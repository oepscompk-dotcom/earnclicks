'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageSquare, MapPin, Clock, Send, CheckCircle, ArrowRight, Headphones, HelpCircle, FileText } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">Contact Us</Badge>
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Have a question, suggestion, or need help? We are here for you. Reach out and we will respond within 24 hours.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  {[
                    { icon: Mail, label: 'Email', value: 'support@earnclicks.app', desc: 'We reply within 24 hours' },
                    { icon: MessageSquare, label: 'Live Chat', value: 'Available 24/7', desc: 'Instant support from our team' },
                    { icon: MapPin, label: 'Office', value: 'San Francisco, CA', desc: '123 Market Street, Suite 400' },
                    { icon: Clock, label: 'Business Hours', value: 'Mon - Fri, 9AM - 6PM PST', desc: 'Excluding federal holidays' },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-4">
                      <div className="rounded-lg bg-primary/10 p-3 h-fit">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{item.label}</div>
                        <div className="font-medium">{item.value}</div>
                        <div className="text-sm text-muted-foreground">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <div className="space-y-3">
                  {[
                    { icon: HelpCircle, label: 'FAQ', desc: 'Find answers to common questions', href: '/dashboard/support' },
                    { icon: FileText, label: 'Documentation', desc: 'Platform guides and tutorials', href: '/dashboard/settings' },
                    { icon: Headphones, label: 'Support Center', desc: 'Submit a ticket for help', href: '/dashboard/support' },
                  ].map((link) => (
                    <Link key={link.label} href={link.href} className="flex items-center gap-3 rounded-lg p-3 hover:bg-muted/50 transition-colors group">
                      <link.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{link.label}</div>
                        <div className="text-xs text-muted-foreground">{link.desc}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-xl border bg-card p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="inline-flex rounded-full bg-green-500/10 p-4 mb-4">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for reaching out. We will get back to you within 24 hours.
                    </p>
                    <Button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }} variant="outline">
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-2">Send Us a Message</h2>
                    <p className="text-muted-foreground mb-6">Fill out the form below and we will get back to you shortly.</p>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Name</label>
                          <input
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Email</label>
                          <input
                            required
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Subject</label>
                        <select
                          required
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="support">Technical Support</option>
                          <option value="billing">Billing Question</option>
                          <option value="advertiser">Advertiser Inquiry</option>
                          <option value="partnership">Partnership Opportunity</option>
                          <option value="bug">Report a Bug</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Message</label>
                        <textarea
                          required
                          rows={5}
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                          placeholder="How can we help you?"
                        />
                      </div>
                      <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25">
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Quick answers to common questions
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            {[
              { q: 'How do I start earning?', a: 'Create an account, complete KYC verification, browse available tasks, and start submitting proof of engagement. You will earn USDT for each approved submission.' },
              { q: 'How fast are withdrawals processed?', a: 'Free tier withdrawals are processed within 24-48 hours. Pro users enjoy instant withdrawals with no waiting period.' },
              { q: 'Can I run ads as an advertiser?', a: 'Yes! Sign up as an advertiser, deposit funds, and create campaigns targeting specific platforms, audiences, and engagement types.' },
              { q: 'What is the referral program?', a: 'Invite friends and earn 10% of their earnings. Pro users earn from 3 levels: 10%, 5%, and 2%. It is passive income for life.' },
              { q: 'Is my personal information safe?', a: 'Absolutely. We use bank-grade encryption, never sell your data, and comply with GDPR and all major privacy regulations.' },
              { q: 'What countries are supported?', a: 'We operate in 195+ countries worldwide. Task availability may vary by region, but anyone can sign up and earn.' },
            ].map((faq, i) => (
              <div key={i} className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
