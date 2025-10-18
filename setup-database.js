import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const sql = `
-- Create ENUM for submission status
CREATE TYPE submission_status AS ENUM ('pending', 'reviewed', 'spam', 'contacted');

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  availability TEXT NOT NULL,
  message TEXT,
  ip_address INET,
  user_agent TEXT,
  device_info JSONB,
  submission_count INTEGER DEFAULT 1,
  is_spam BOOLEAN DEFAULT false,
  spam_score INTEGER DEFAULT 0,
  status submission_status DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_ip ON public.contact_submissions(ip_address);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_phone ON public.contact_submissions(phone);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_spam ON public.contact_submissions(is_spam, spam_score);

-- Auto-update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Spam detection
CREATE OR REPLACE FUNCTION detect_spam_submission()
RETURNS TRIGGER AS $$
DECLARE
  ip_submissions_count INTEGER;
  phone_submissions_count INTEGER;
  spam_keywords TEXT[] := ARRAY['viagra', 'casino', 'lottery', 'prize', 'click here', 'buy now'];
  keyword TEXT;
  calculated_spam_score INTEGER := 0;
BEGIN
  SELECT COUNT(*) INTO ip_submissions_count
  FROM public.contact_submissions
  WHERE ip_address = NEW.ip_address AND created_at > NOW() - INTERVAL '1 hour';

  IF ip_submissions_count >= 3 THEN
    calculated_spam_score := calculated_spam_score + 30;
  END IF;

  SELECT COUNT(*) INTO phone_submissions_count
  FROM public.contact_submissions
  WHERE phone = NEW.phone AND created_at > NOW() - INTERVAL '24 hours';

  IF phone_submissions_count >= 2 THEN
    calculated_spam_score := calculated_spam_score + 25;
  END IF;

  IF NEW.message IS NOT NULL THEN
    FOREACH keyword IN ARRAY spam_keywords
    LOOP
      IF LOWER(NEW.message) LIKE '%' || keyword || '%' THEN
        calculated_spam_score := calculated_spam_score + 20;
      END IF;
    END LOOP;

    IF NEW.message = UPPER(NEW.message) AND LENGTH(NEW.message) > 20 THEN
      calculated_spam_score := calculated_spam_score + 15;
    END IF;

    IF (LENGTH(NEW.message) - LENGTH(REPLACE(NEW.message, '!', ''))) > 3 THEN
      calculated_spam_score := calculated_spam_score + 10;
    END IF;
  END IF;

  NEW.spam_score := calculated_spam_score;
  NEW.submission_count := ip_submissions_count + 1;

  IF calculated_spam_score >= 50 THEN
    NEW.is_spam := true;
    NEW.status := 'spam';
  END IF;

  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER check_spam_before_insert
  BEFORE INSERT ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION detect_spam_submission();

-- RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public inserts" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow admin reads" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow admin updates" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow admin deletes" ON public.contact_submissions;

CREATE POLICY "Allow public inserts" ON public.contact_submissions
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow admin reads" ON public.contact_submissions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin' OR auth.users.email = 'admin@dss-training.co.uk')
    )
  );

CREATE POLICY "Allow admin updates" ON public.contact_submissions
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin' OR auth.users.email = 'admin@dss-training.co.uk')
    )
  );

CREATE POLICY "Allow admin deletes" ON public.contact_submissions
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin' OR auth.users.email = 'admin@dss-training.co.uk')
    )
  );
`;

console.log('🚀 Creating database schema...\n');

const { error } = await supabase.rpc('exec_sql', { query: sql });

if (error) {
  console.error('❌ Error:', error.message);
  console.log('\n💡 Running via REST API instead...\n');

  // Use REST API to execute
  const response = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/rpc/exec`, {
    method: 'POST',
    headers: {
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });

  if (!response.ok) {
    console.error('❌ Failed. Please run the SQL manually in Supabase Dashboard.');
    console.log('\n📋 Go to: https://supabase.com/dashboard/project/diwbpuyvvqcxyjuohzef/sql');
  }
} else {
  console.log('✅ Database schema created successfully!');
}
