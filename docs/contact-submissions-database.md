# Contact Submissions Database Documentation

## Overview
The `contact_submissions` table stores all form submissions from the landing page contact form with built-in spam detection and admin workflow management capabilities.

## Table Schema

### Core Form Fields
- `id` (UUID, PK): Auto-generated unique identifier
- `name` (TEXT, required): User's full name
- `phone` (TEXT, required): UK phone number (11 digits starting with 0)
- `availability` (TEXT, required): Preferred contact time
  - Options: `morning`, `noon`, `evening`, `weekends`
- `message` (TEXT, optional): Additional message from user
- `created_at` (TIMESTAMP, auto): Submission timestamp

### Spam Detection Fields
- `ip_address` (INET): Submitter's IP address
- `device_fingerprint` (TEXT): Unique device identifier
- `user_agent` (TEXT): Browser/device information
- `is_spam` (BOOLEAN, default: false): Spam flag
- `spam_score` (INTEGER, 0-100): Auto-calculated spam likelihood
- `spam_reason` (TEXT): Why marked as spam
- `submission_count_from_ip` (INTEGER): Submissions from same IP in 24h

### Admin Workflow Fields
- `status` (TEXT, default: 'new'): Current status
  - `new`: Fresh submission, not yet contacted
  - `contacted`: Admin has called the user
  - `in_negotiation`: Actively discussing with user
  - `converted`: User agreed/enrolled
  - `spam`: Marked as spam
  - `rejected`: User not interested
- `admin_notes` (TEXT): Admin notes about calls/negotiations
- `assigned_to` (UUID): Admin handling this lead
- `reviewed_by` (UUID): Admin who last reviewed
- `reviewed_at` (TIMESTAMP): When last reviewed
- `last_contacted_at` (TIMESTAMP): When admin last called
- `next_followup_at` (TIMESTAMP): Schedule next call
- `updated_at` (TIMESTAMP, auto): Last update time

## Row Level Security (RLS) Policies

### 1. Public Insert
Anyone (anonymous or authenticated) can submit the contact form.
```typescript
// Public form submission - only core fields should be set
const { data, error } = await supabase
  .from('contact_submissions')
  .insert({
    name: 'John Smith',
    phone: '07123 456789',
    availability: 'morning',
    message: 'Looking to start driving lessons',
    ip_address: userIP, // Get from request
    device_fingerprint: deviceId, // Generate client-side
    user_agent: navigator.userAgent
  });
```

### 2. Admin-Only Read
Only authenticated users with `role: 'admin'` in their user metadata can view submissions.

**Setting admin role:**
```sql
-- Run in SQL Editor to make a user an admin
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@example.com';
```

**Querying as admin:**
```typescript
// Admin viewing all submissions
const { data, error } = await supabase
  .from('contact_submissions')
  .select('*')
  .order('created_at', { ascending: false });

// Filter by status
const { data } = await supabase
  .from('contact_submissions')
  .select('*')
  .eq('status', 'new')
  .eq('is_spam', false);
```

### 3. Admin-Only Update
Only admins can update submissions (change status, mark spam, add notes).

```typescript
// Mark as contacted
const { data, error } = await supabase
  .from('contact_submissions')
  .update({
    status: 'contacted',
    last_contacted_at: new Date().toISOString(),
    admin_notes: 'Spoke with user, interested in automatic lessons',
    reviewed_by: currentUserId,
    reviewed_at: new Date().toISOString()
  })
  .eq('id', submissionId);

// Mark as spam
const { data, error } = await supabase
  .from('contact_submissions')
  .update({
    is_spam: true,
    status: 'spam',
    spam_reason: 'Multiple submissions with fake data',
    reviewed_by: currentUserId,
    reviewed_at: new Date().toISOString()
  })
  .eq('id', submissionId);

// Assign to admin
const { data, error } = await supabase
  .from('contact_submissions')
  .update({
    assigned_to: adminUserId,
    reviewed_by: currentUserId,
    reviewed_at: new Date().toISOString()
  })
  .eq('id', submissionId);
```

### 4. No Delete Policy
Submissions cannot be deleted to maintain spam analysis history. Admins can manually delete via SQL if necessary.

## Automatic Spam Detection

The system automatically calculates a spam score (0-100) based on:

### Scoring Factors
1. **Multiple submissions from same IP (24h window)**
   - 5+ submissions: +40 points
   - 3-4 submissions: +25 points

2. **Duplicate phone number**
   - 3+ submissions: +30 points
   - 2 submissions: +15 points

3. **Rapid successive submissions (5 min window)**
   - 3+ submissions: +35 points
   - 2 submissions: +20 points

4. **Suspicious name patterns**
   - All caps (>5 chars): +15 points
   - Special characters: +10 points
   - Too short (<3 chars): +20 points

5. **Suspicious message content**
   - Contains URLs: +25 points
   - All caps (>10 chars): +10 points

### Auto-Spam Marking
If spam_score >= 70, the submission is automatically:
- Marked as `is_spam: true`
- Set status to `spam`
- Given a spam_reason explaining the high score

## Indexes for Performance

The following indexes optimize common queries:
- `idx_contact_submissions_ip_address`: Fast IP lookup
- `idx_contact_submissions_phone`: Duplicate phone detection
- `idx_contact_submissions_created_at`: Time-based queries
- `idx_contact_submissions_status`: Filter by workflow status
- `idx_contact_submissions_assigned_to`: Admin's assigned leads
- `idx_contact_submissions_is_spam`: Spam filtering
- `idx_contact_submissions_next_followup`: Upcoming followups

## Usage Examples

### Frontend: Submit Contact Form
```typescript
import { supabase } from '@/lib/supabase';
import type { ContactSubmissionInsert } from '@/lib/database.types';

async function submitContactForm(formData: {
  name: string;
  phone: string;
  availability: string;
  message?: string;
}) {
  // Get client-side info for spam detection
  const getDeviceFingerprint = () => {
    // Simple fingerprint - combine screen, timezone, language
    return btoa(`${screen.width}x${screen.height}-${new Date().getTimezoneOffset()}-${navigator.language}`);
  };

  const submission: ContactSubmissionInsert = {
    name: formData.name,
    phone: formData.phone,
    availability: formData.availability,
    message: formData.message,
    device_fingerprint: getDeviceFingerprint(),
    user_agent: navigator.userAgent,
    // Note: ip_address should be set server-side if using Edge Functions
  };

  const { data, error } = await supabase
    .from('contact_submissions')
    .insert(submission)
    .select()
    .single();

  if (error) {
    console.error('Error submitting form:', error);
    throw error;
  }

  return data;
}
```

### Admin Dashboard: View Submissions
```typescript
import { supabase } from '@/lib/supabase';
import type { ContactSubmission, SubmissionStatus } from '@/lib/database.types';

// Get all new, non-spam submissions
async function getNewSubmissions() {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .eq('status', 'new')
    .eq('is_spam', false)
    .order('created_at', { ascending: false });

  return data as ContactSubmission[];
}

// Get submissions assigned to current admin
async function getMyAssignedLeads(adminId: string) {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .eq('assigned_to', adminId)
    .in('status', ['contacted', 'in_negotiation'])
    .order('next_followup_at', { ascending: true, nullsFirst: false });

  return data as ContactSubmission[];
}

// Get high spam score submissions for review
async function getSuspiciousSubmissions() {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .gte('spam_score', 50)
    .lt('spam_score', 70) // Below auto-spam threshold
    .eq('is_spam', false)
    .order('spam_score', { ascending: false });

  return data as ContactSubmission[];
}
```

### Admin Dashboard: Update Submission Status
```typescript
import { supabase } from '@/lib/supabase';
import type { ContactSubmissionUpdate, SubmissionStatus } from '@/lib/database.types';

async function updateSubmissionStatus(
  submissionId: string,
  status: SubmissionStatus,
  notes?: string,
  adminId?: string
) {
  const update: ContactSubmissionUpdate = {
    status,
    reviewed_at: new Date().toISOString(),
    reviewed_by: adminId,
  };

  if (notes) {
    update.admin_notes = notes;
  }

  if (status === 'contacted') {
    update.last_contacted_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('contact_submissions')
    .update(update)
    .eq('id', submissionId)
    .select()
    .single();

  return data as ContactSubmission;
}

// Schedule a followup
async function scheduleFollowup(
  submissionId: string,
  followupDate: Date,
  adminId: string
) {
  const { data, error } = await supabase
    .from('contact_submissions')
    .update({
      next_followup_at: followupDate.toISOString(),
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', submissionId)
    .select()
    .single();

  return data as ContactSubmission;
}
```

## Analytics Queries

### Spam Statistics
```typescript
// Get spam statistics
async function getSpamStats() {
  const { count: totalCount } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true });

  const { count: spamCount } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('is_spam', true);

  return {
    total: totalCount || 0,
    spam: spamCount || 0,
    legitimate: (totalCount || 0) - (spamCount || 0),
    spamRate: totalCount ? ((spamCount || 0) / totalCount) * 100 : 0,
  };
}
```

### Conversion Funnel
```typescript
// Track conversion funnel
async function getConversionFunnel() {
  const statuses: SubmissionStatus[] = ['new', 'contacted', 'in_negotiation', 'converted'];
  const counts: Record<string, number> = {};

  for (const status of statuses) {
    const { count } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', status)
      .eq('is_spam', false);

    counts[status] = count || 0;
  }

  return counts;
}
```

## Maintenance

### Viewing Migrations
```bash
# List all migrations
supabase db migrations list
```

### Regenerating Types
```bash
# Generate latest TypeScript types
npx supabase gen types typescript --local > src/lib/database.types.ts
```

### Security Advisors
Run security checks to ensure RLS policies are working correctly:
```typescript
// The migrations include security advisors check
// All functions have secure search_path set
```

## Important Notes

1. **IP Address**: For accurate spam detection, capture the user's real IP address. If using Edge Functions or API routes, pass the IP from the server side.

2. **Admin Role**: Users must have `role: 'admin'` in their `raw_user_meta_data` to access submissions.

3. **No Deletes**: Submissions cannot be deleted through the API. This maintains spam analysis data. Admins can delete via SQL if absolutely necessary.

4. **Auto-Spam**: Submissions with spam_score >= 70 are automatically marked as spam. Review the `spam_reason` field to understand why.

5. **Timestamps**: All timestamps use ISO 8601 format with timezone information.

6. **Phone Format**: Expected format is UK phone numbers (11 digits starting with 0), but validation should be done client-side as well.
