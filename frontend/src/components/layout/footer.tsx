'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Send, CheckCircle, Shield, Zap, Globe, Lock, CreditCard, Users, TrendingUp, ArrowRight, Heart, ExternalLink, Gamepad2, Mail } from 'lucide-react';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { LogoImage } from '@/components/ui/logo-image';
import { cn } from '@/lib/utils';

const platformCol = [
  { label: 'Home', href: '/' },
  { label: 'Earn Money', href: '/register?role=user' },
  { label: 'Available Tasks', href: '/dashboard/tasks' },
  { label: 'VIP Membership', href: '/#vip' },
  { label: 'Referral Program', href: '/#referral' },
  { label: 'Leaderboard', href: '/#leaderboard' },
  { label: 'Mobile App', href: '/#download' },
];

const advertiserCol = [
  { label: 'Create Campaign', href: '/register?role=advertiser' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Campaign Analytics', href: '/advertiser/analytics' },
  { label: 'Featured Campaigns', href: '/#campaigns' },
  { label: 'API', href: '/api-docs' },
  { label: 'Enterprise', href: '/enterprise' },
];

const supportCol = [
  { label: 'Help Center', href: '/support' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Support Tickets', href: '/dashboard/support' },
  { label: 'Live Chat', href: '/contact' },
  { label: 'Contact', href: '/contact' },
  { label: 'Report Abuse', href: '/report' },
];

const legalCol = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
  { label: 'AML Policy', href: '/aml' },
  { label: 'KYC Policy', href: '/kyc-policy' },
  { label: 'Refund Policy', href: '/refund' },
  { label: 'Risk Disclosure', href: '/risk' },
];

const paymentMethods = ['USDT TRC20', 'USDT BEP20', 'USDT ERC20', 'Bitcoin', 'Ethereum', 'Binance Pay', 'Perfect Money', 'Payeer'];
const supportedPlatforms = ['Facebook', 'Instagram', 'TikTok', 'YouTube', 'Telegram', 'Discord', 'LinkedIn', 'Pinterest', 'Reddit', 'Website'];

const stats = [
  { value: '250K+', label: 'Registered Users', icon: <Users className="h-6 w-6" /> },
  { value: '1M+', label: 'Completed Tasks', icon: <CheckCircle className="h-6 w-6" /> },
  { value: '500K+', label: 'USDT Paid', icon: <CreditCard className="h-6 w-6" /> },
  { value: '150+', label: 'Countries', icon: <Globe className="h-6 w-6" /> },
];

const securityBadges = ['SSL Secure', '256-bit Encryption', 'Google reCAPTCHA', 'KYC Verified', '2FA Security', 'AI Fraud Protection'];

const socialLinks = [
  { icon: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, href: '#', label: 'Facebook' },
  { icon: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>, href: '#', label: 'Instagram' },
  { icon: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48A6.34 6.34 0 0015.93 9.3a6.3 6.3 0 003.66 1.18V7.03a4.85 4.85 0 01-2-.34z"/></svg>, href: '#', label: 'TikTok' },
  { icon: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>, href: '#', label: 'YouTube' },
  { icon: <Send className="h-4 w-4" />, href: '#', label: 'Telegram' },
  { icon: <Gamepad2 className="h-4 w-4" />, href: '#', label: 'Discord' },
  { icon: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>, href: '#', label: 'LinkedIn' },
  { icon: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, href: '#', label: 'X' },
];

function DefaultFooterLogo() {
  return (
    <svg viewBox="0 0 200 48" className="h-9 w-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ftr" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="50%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#6ee7b7" />
        </linearGradient>
      </defs>
      <text x="0" y="36" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontSize="36" fill="url(#ftr)" letterSpacing="-1">EarnClicks</text>
    </svg>
  );
}

export function Footer() {
  const { logos, loading } = useSiteSettings();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setEmail(''); }
  };

  return (
    <footer>
      <div className="gradient-primary py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Start Earning?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">Join thousands of users earning USDT every day or launch your next advertising campaign.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register?role=user" className="inline-flex items-center gap-2 bg-white text-[#2D4F97] rounded-xl px-8 py-3.5 text-sm font-bold hover:bg-white/90 transition-colors shadow-xl">
              Become a Tasker <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/register?role=advertiser" className="inline-flex items-center gap-2 border-2 border-white text-white rounded-xl px-8 py-3.5 text-sm font-bold hover:bg-white/10 transition-colors">
              Become an Advertiser <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-[#0F172A] text-gray-400">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                {loading ? <DefaultFooterLogo /> : <LogoImage src={logos.footer_logo} type={logos.footer_logo_type} alt="EarnClicks" defaultLogo={<DefaultFooterLogo />} />}
              </Link>
              <p className="text-sm leading-relaxed max-w-xs mb-6">EarnClicks is a global Social Task & Rewards Platform where users earn USDT by completing social media tasks, while advertisers grow their brands with real engagement from active users worldwide.</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {[{ label: 'Secure Platform', icon: <Shield className="h-3 w-3" /> }, { label: 'Fast Withdrawals', icon: <Zap className="h-3 w-3" /> }, { label: 'AI Verification', icon: <CheckCircle className="h-3 w-3" /> }, { label: 'Trusted Worldwide', icon: <Globe className="h-3 w-3" /> }].map((b) => (
                  <span key={b.label} className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-xs text-gray-300">{b.icon}{b.label}</span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {socialLinks.map((s) => (
                  <a key={s.label} href={s.href} className="bg-white/10 hover:bg-white/20 rounded-xl p-2.5 text-gray-400 hover:text-white transition-all" title={s.label}>{s.icon}</a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-heading text-sm font-semibold text-white mb-4 uppercase tracking-wider">Platform</h3>
              <ul className="space-y-1">{platformCol.map((l) => <li key={l.href}><Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors py-1 block">{l.label}</Link></li>)}</ul>
            </div>

            <div>
              <h3 className="font-heading text-sm font-semibold text-white mb-4 uppercase tracking-wider">Advertisers</h3>
              <ul className="space-y-1">{advertiserCol.map((l) => <li key={l.href}><Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors py-1 block">{l.label}</Link></li>)}</ul>
            </div>

            <div>
              <h3 className="font-heading text-sm font-semibold text-white mb-4 uppercase tracking-wider">Support</h3>
              <ul className="space-y-1">{supportCol.map((l) => <li key={l.href}><Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors py-1 block">{l.label}</Link></li>)}</ul>
            </div>

            <div>
              <h3 className="font-heading text-sm font-semibold text-white mb-4 uppercase tracking-wider">Legal</h3>
              <ul className="space-y-1">{legalCol.map((l) => <li key={l.href}><Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors py-1 block">{l.label}</Link></li>)}</ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto mb-8">
              <span className="text-sm font-semibold text-white flex items-center gap-2"><Mail className="h-4 w-4" /> Stay Updated</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="flex-1 w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button type="submit" className="gradient-primary text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap">Subscribe</button>
            </form>
          </div>

          <div className="border-t border-white/10 pt-8 mb-8">
            <p className="text-xs text-gray-500 text-center uppercase tracking-wider mb-4">Supported Payment Networks</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {paymentMethods.map((pm) => (
                <span key={pm} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-400 font-medium">{pm}</span>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 mb-8">
            <p className="text-xs text-gray-500 text-center uppercase tracking-wider mb-4">Supported Platforms</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {supportedPlatforms.map((p) => (
                <span key={p} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-400 font-medium">{p}</span>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 text-[#18C97A] mb-3">{s.icon}</div>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 mb-8">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {securityBadges.map((b) => (
                <span key={b} className="flex items-center gap-1.5 text-xs text-gray-500"><Lock className="h-3 w-3" />{b}</span>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">&copy; 2026 EarnClicks. All Rights Reserved.</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">Made with <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400" /> for the Global Community</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Version 1.0</span>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" />Status</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
