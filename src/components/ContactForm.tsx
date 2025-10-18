import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Sunrise, Sun, Sunset, Calendar, CheckCircle2, Loader2, Sparkles, Phone, User, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import type { ContactSubmissionInsert } from "@/lib/database.types";

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    availability: "",
    message: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    availability: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const validation = {
    name: formData.name.trim().length >= 2,
    phone: formData.phone.replace(/\s/g, "").length === 11 && formData.phone.startsWith("0"),
    availability: formData.availability !== "",
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits

    // Format UK phone number
    if (value.length > 0) {
      if (value.startsWith("44")) {
        value = "0" + value.slice(2);
      }

      // Format as 07XXX XXXXXX
      if (value.length <= 5) {
        value = value;
      } else if (value.length <= 11) {
        value = value.slice(0, 5) + " " + value.slice(5);
      } else {
        value = value.slice(0, 5) + " " + value.slice(5, 11);
      }
    }

    setFormData({ ...formData, phone: value });
  };

  const getDeviceFingerprint = () => {
    // Simple fingerprint - combine screen, timezone, language
    return btoa(`${screen.width}x${screen.height}-${new Date().getTimezoneOffset()}-${navigator.language}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark that submit was attempted
    setAttemptedSubmit(true);

    // Basic validation
    if (!formData.name.trim() || !formData.phone.trim() || !formData.availability.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate UK phone number
    const phoneDigits = formData.phone.replace(/\s/g, "");
    if (phoneDigits.length !== 11 || !phoneDigits.startsWith("0")) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid UK phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const submission: ContactSubmissionInsert = {
        name: formData.name.trim(),
        phone: phoneDigits,
        availability: formData.availability,
        message: formData.message.trim() || null,
        device_fingerprint: getDeviceFingerprint(),
        user_agent: navigator.userAgent,
      };

      // Insert the submission
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert(submission)
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      console.log('Submission successful:', data);

      // Show success animation
      setShowSuccess(true);

      // Reset form after showing success
      setTimeout(() => {
        setFormData({
          name: "",
          phone: "",
          availability: "",
          message: "",
        });
        setTouched({
          name: false,
          phone: false,
          availability: false,
        });
        setAttemptedSubmit(false);
        setShowSuccess(false);
      }, 3000);

      toast({
        title: "Request Submitted!",
        description: "We'll contact you shortly to discuss your training options.",
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-gradient-to-b from-background via-secondary/20 to-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-4"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Quick & Easy Process</span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-3 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Start Your Journey Today
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Fill in the form below and we'll get back to you within 24 hours to discuss your personalized training plan
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Glowing border effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-accent via-blue-500 to-accent rounded-[2rem] opacity-20 blur-xl"></div>

            <div className="relative bg-card/80 backdrop-blur-xl rounded-[2rem] border border-border/50 p-6 md:p-8 shadow-2xl">
              <AnimatePresence mode="wait">
                {showSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 px-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <div className="relative">
                        <motion.div
                          className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0.8, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                        <CheckCircle2 className="w-24 h-24 text-green-500 relative z-10" />
                      </div>
                    </motion.div>
                    <motion.h3
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-3xl font-bold text-foreground mt-4 mb-2"
                    >
                      Request Submitted!
                    </motion.h3>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-muted-foreground text-center max-w-md"
                    >
                      Thank you for choosing us! We'll contact you shortly to discuss your training options.
                    </motion.p>
                    <motion.div
                      className="flex gap-2 mt-6"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: 0 }}
                          animate={{ scale: 1, rotate: 360 }}
                          transition={{
                            delay: 0.7 + i * 0.1,
                            type: "spring",
                          }}
                        >
                          <Sparkles className="w-6 h-6 text-yellow-500" />
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {/* Name Field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="name" className="text-foreground font-semibold text-base flex items-center gap-2">
                        <User className="w-4 h-4 text-accent" />
                        Full Name *
                      </Label>
                      <div className="relative group">
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Smith"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={isSubmitting}
                          className={`h-12 text-base px-4 transition-all duration-300 ${
                            attemptedSubmit && !validation.name
                              ? 'border-red-400 focus:ring-red-400/20 focus:border-red-500 bg-red-50/5'
                              : attemptedSubmit && validation.name
                              ? 'border-green-400 focus:ring-green-400/20 focus:border-green-500 bg-green-50/5'
                              : 'focus:ring-accent/20 border-border hover:border-accent/50 group-hover:shadow-lg'
                          }`}
                        />
                      </div>
                      {attemptedSubmit && !validation.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500 flex items-center gap-1"
                        >
                          Please enter your full name (at least 2 characters)
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Phone Field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="phone" className="text-foreground font-semibold text-base flex items-center gap-2">
                        <Phone className="w-4 h-4 text-accent" />
                        Phone Number *
                      </Label>
                      <div className="relative group">
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="07123 456789"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          disabled={isSubmitting}
                          className={`h-12 text-base px-4 transition-all duration-300 ${
                            attemptedSubmit && !validation.phone
                              ? 'border-red-400 focus:ring-red-400/20 focus:border-red-500 bg-red-50/5'
                              : attemptedSubmit && validation.phone
                              ? 'border-green-400 focus:ring-green-400/20 focus:border-green-500 bg-green-50/5'
                              : 'focus:ring-accent/20 border-border hover:border-accent/50 group-hover:shadow-lg'
                          }`}
                          maxLength={12}
                        />
                      </div>
                      {attemptedSubmit && !validation.phone && formData.phone && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500"
                        >
                          Please enter a valid UK phone number (11 digits starting with 0)
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Availability Field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="availability" className="text-foreground font-semibold text-base flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent" />
                        Preferred Contact Time *
                      </Label>
                      <div className="relative">
                        <select
                          id="availability"
                          value={formData.availability}
                          onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                          disabled={isSubmitting}
                          className={`h-12 w-full text-base px-4 rounded-md border bg-background transition-all duration-300 appearance-none cursor-pointer ${
                            attemptedSubmit && validation.availability
                              ? 'border-green-400 focus:ring-2 focus:ring-green-400/20 focus:border-green-500 bg-green-50/5'
                              : attemptedSubmit && !validation.availability
                              ? 'border-red-400 focus:ring-2 focus:ring-red-400/20 focus:border-red-500 bg-red-50/5'
                              : 'border-border focus:ring-2 focus:ring-accent/20 hover:border-accent/50 hover:shadow-lg focus:outline-none'
                          }`}
                        >
                          <option value="" disabled>Select your preferred time</option>
                          <option value="morning">🌅 Morning (8:00 AM - 12:00 PM)</option>
                          <option value="noon">☀️ Noon (12:00 PM - 4:00 PM)</option>
                          <option value="evening">🌆 Evening (4:00 PM - 8:00 PM)</option>
                          <option value="weekends">📅 Weekends (Saturday or Sunday)</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {attemptedSubmit && !validation.availability && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500"
                        >
                          Please select your preferred contact time
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Message Field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="message" className="text-foreground font-semibold text-base">
                        Anything we should know? (Optional)
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your experience, goals, or any questions you have..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        disabled={isSubmitting}
                        className="min-h-28 resize-none transition-all duration-300 focus:ring-2 focus:ring-accent/20 border-border hover:border-accent/50 hover:shadow-lg text-base p-4"
                      />
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                      className="pt-2"
                    >
                      <Button
                        type="submit"
                        variant="accent"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full h-12 text-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
                      >
                        <AnimatePresence mode="wait">
                          {isSubmitting ? (
                            <motion.div
                              key="loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-3"
                            >
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Submitting Request...</span>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="submit"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-2"
                            >
                              <Phone className="w-5 h-5" />
                              <span>Request Callback</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {/* Animated shine effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{
                            x: ['-100%', '100%'],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1,
                          }}
                        />
                      </Button>
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-sm text-muted-foreground text-center pt-2"
                    >
                      By submitting this form, you agree to be contacted by DSS regarding your training enquiry.
                    </motion.p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
