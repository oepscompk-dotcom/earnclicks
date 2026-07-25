'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Check, Star, Play, ArrowUpRight, Users, Target, DollarSign, Shield, Zap,
  Smartphone, Gift, BadgeCheck, Layers, BarChart3, Wallet, Eye, MousePointerClick,
  Heart, MessageCircle, Share2, UserPlus, ThumbsUp, Twitter, Instagram, Youtube,
  Facebook, Music, Gamepad2, Linkedin, Download, Globe, Clock, Award, TrendingUp,
  ChevronDown, ArrowRight, Coins, Rocket, Lock, Headphones, Crown, Diamond, Gem,
  CreditCard, Trophy, CheckCircle2, Search, Sparkles, ShieldCheck, Brain, Scan,
  Upload, FileCheck, AlertTriangle, Globe2, Fingerprint, Cpu, Bot, Send,
  MapPin, Phone, Mail, Flame, ZapOff, ShieldAlert, LockKeyhole, ServerCrash,
  Network, BadgePercent, Calculator, BarChart2, LineChart, TrendingDown,
  Circle, Hexagon, StarHalf, Bookmark, Tag, LayoutGrid, FileText, Truck, Navigation,
  Compass, Crosshair, Radar, ShieldOff, ShieldX, ShieldHalf, ExternalLink,
  Clock3, CalendarDays, Ban, EyeOff, Code, Folder, Package, Map, MoveRight,
  ChevronRight, CircleDollarSign, Medal, Timer, Plus, Minus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoImage } from '@/components/ui/logo-image';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { useInView } from '@/hooks/use-in-view';

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView(0.08);
  return (
    <div ref={ref} className={`reveal-up ${inView ? 'revealed' : ''} ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

function CountUp({ end, duration = 2000, suffix = '', prefix = '' }: { end: number; duration?: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

function SectionHeading({ badge, title, subtitle, light = false }: { badge: string; title: string; subtitle: string; light?: boolean }) {
  return (
    <Reveal className="text-center max-w-3xl mx-auto mb-16">
      <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 ${light ? 'bg-[#2D4F97]/10 text-[#2D4F97]' : 'bg-white/10 text-white/80'}`}>
        <Sparkles className="h-3.5 w-3.5" /> {badge}
      </span>
      <h2 className={`font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${light ? 'text-gray-900' : 'text-white'}`}>{title}</h2>
      <p className={`text-lg ${light ? 'text-gray-500' : 'text-white/60'}`}>{subtitle}</p>
    </Reveal>
  );
}

function DefaultLogo() {
  return (
    <svg viewBox="0 0 200 48" className="h-8 w-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lgr" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2D4F97" />
          <stop offset="50%" stopColor="#1E8A8D" />
          <stop offset="100%" stopColor="#18C97A" />
        </linearGradient>
      </defs>
      <text x="0" y="36" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontSize="36" fill="url(#lgr)" letterSpacing="-1">EarnClicks</text>
    </svg>
  );
}

const platformData = [
  { name: 'Facebook', icon: 'facebook', tasks: '12,450', color: '#1877F2' },
  { name: 'Instagram', icon: 'instagram', tasks: '18,230', color: '#E4405F' },
  { name: 'TikTok', icon: 'tiktok', tasks: '22,100', color: '#000000' },
  { name: 'YouTube', icon: 'youtube', tasks: '15,670', color: '#FF0000' },
  { name: 'Telegram', icon: 'telegram', tasks: '8,920', color: '#26A5E4' },
  { name: 'Discord', icon: 'discord', tasks: '5,340', color: '#5865F2' },
  { name: 'Twitter / X', icon: 'twitter', tasks: '9,800', color: '#1DA1F2' },
  { name: 'LinkedIn', icon: 'linkedin', tasks: '3,210', color: '#0A66C2' },
  { name: 'Pinterest', icon: 'pinterest', tasks: '4,580', color: '#E60023' },
  { name: 'Reddit', icon: 'reddit', tasks: '6,720', color: '#FF4500' },
  { name: 'Website Visits', icon: 'website', tasks: '31,200', color: '#6366F1' },
  { name: 'App Installs', icon: 'app', tasks: '14,300', color: '#10B981' },
];

const platformIcons: Record<string, React.ReactNode> = {
  facebook: <Facebook className="h-7 w-7" />,
  instagram: <Instagram className="h-7 w-7" />,
  youtube: <Youtube className="h-7 w-7" />,
  tiktok: <Music className="h-7 w-7" />,
  telegram: <Send className="h-7 w-7" />,
  twitter: <Twitter className="h-7 w-7" />,
  discord: <Gamepad2 className="h-7 w-7" />,
  linkedin: <Linkedin className="h-7 w-7" />,
  pinterest: <Bookmark className="h-7 w-7" />,
  reddit: <Globe className="h-7 w-7" />,
  website: <Globe2 className="h-7 w-7" />,
  app: <Smartphone className="h-7 w-7" />,
};

const taskTypes = [
  { title: 'Watch Video', reward: '0.02 USDT', difficulty: 'Easy', time: '2 min', icon: <Play className="h-6 w-6" />, color: '#FF0000' },
  { title: 'Like Post', reward: '0.01 USDT', difficulty: 'Easy', time: '30 sec', icon: <ThumbsUp className="h-6 w-6" />, color: '#1877F2' },
  { title: 'Follow Account', reward: '0.03 USDT', difficulty: 'Easy', time: '1 min', icon: <UserPlus className="h-6 w-6" />, color: '#E4405F' },
  { title: 'Write Comment', reward: '0.04 USDT', difficulty: 'Medium', time: '3 min', icon: <MessageCircle className="h-6 w-6" />, color: '#1DA1F2' },
  { title: 'Share Post', reward: '0.035 USDT', difficulty: 'Easy', time: '1 min', icon: <Share2 className="h-6 w-6" />, color: '#1877F2' },
  { title: 'Subscribe', reward: '0.025 USDT', difficulty: 'Easy', time: '1 min', icon: <Heart className="h-6 w-6" />, color: '#FF0000' },
  { title: 'Telegram Join', reward: '0.02 USDT', difficulty: 'Easy', time: '30 sec', icon: <Send className="h-6 w-6" />, color: '#26A5E4' },
  { title: 'Discord Join', reward: '0.025 USDT', difficulty: 'Easy', time: '1 min', icon: <Gamepad2 className="h-6 w-6" />, color: '#5865F2' },
  { title: 'Website Visit', reward: '0.01 USDT', difficulty: 'Easy', time: '30 sec', icon: <MousePointerClick className="h-6 w-6" />, color: '#6366F1' },
  { title: 'Survey', reward: '0.10 USDT', difficulty: 'Hard', time: '10 min', icon: <FileCheck className="h-6 w-6" />, color: '#10B981' },
  { title: 'App Install', reward: '0.05 USDT', difficulty: 'Medium', time: '5 min', icon: <Download className="h-6 w-6" />, color: '#F59E0B' },
  { title: 'Product Review', reward: '0.08 USDT', difficulty: 'Hard', time: '7 min', icon: <Star className="h-6 w-6" />, color: '#8B5CF6' },
];

const liveTasks = [
  { task: 'Watch YouTube Video', reward: '0.02 USDT', country: 'Global', workers: 245, slots: 500, platform: 'youtube' },
  { task: 'Like Instagram Post', reward: '0.01 USDT', country: 'Global', workers: 320, slots: 500, platform: 'instagram' },
  { task: 'Follow Twitter Account', reward: '0.03 USDT', country: 'US, UK, CA', workers: 89, slots: 200, platform: 'twitter' },
  { task: 'Join Telegram Group', reward: '0.02 USDT', country: 'Global', workers: 156, slots: 300, platform: 'telegram' },
  { task: 'Subscribe YouTube Channel', reward: '0.025 USDT', country: 'Global', workers: 201, slots: 400, platform: 'youtube' },
];

const vipTiers = [
  { name: 'VIP 1', price: '10 USDT', reward: '+20%', daily: '5 Tasks', color: '#94A3B8', icon: <Star className="h-6 w-6" /> },
  { name: 'VIP 2', price: '50 USDT', reward: '+40%', daily: '10 Tasks', color: '#F59E0B', icon: <Award className="h-6 w-6" /> },
  { name: 'VIP 3', price: '200 USDT', reward: '+60%', daily: '20 Tasks', color: '#A78BFA', icon: <Gem className="h-6 w-6" /> },
  { name: 'VIP 4', price: '500 USDT', reward: '+100%', daily: 'Unlimited', color: '#F59E0B', icon: <Crown className="h-6 w-6" /> },
];

const testimonials = [
  { name: 'Ahmed R.', country: 'Egypt', flag: '🇪🇬', amount: '$1,250/mo', rating: 5, text: 'EarnClicks changed my life. I earn daily from simple social media tasks. The best platform I have ever used!' },
  { name: 'Sarah K.', country: 'Philippines', flag: '🇵🇭', amount: '$890/mo', rating: 5, text: 'Easy to use and fast withdrawals. I love the referral system — it is an extra income stream.' },
  { name: 'Carlos M.', country: 'Brazil', flag: '🇧🇷', amount: '$2,100/mo', rating: 5, text: 'As an advertiser, the engagement quality is amazing. Real users, real results.' },
  { name: 'Aisha B.', country: 'Nigeria', flag: '🇳🇬', amount: '$670/mo', rating: 5, text: 'Started with zero experience. Now I earn consistently. VIP membership is worth it!' },
  { name: 'Dmitry K.', country: 'Ukraine', flag: '🇺🇦', amount: '$1,800/mo', rating: 5, text: 'Best USDT earning platform. The AI verification ensures fair work for everyone.' },
  { name: 'Maya L.', country: 'Indonesia', flag: '🇮🇩', amount: '$520/mo', rating: 5, text: 'Perfect for students. I earn during my free time. Highly recommended!' },
];

const faqData = [
  { q: 'What is EarnClicks?', a: 'EarnClicks is a global social task marketplace where users earn USDT by completing social media tasks, and advertisers promote their brands through real user engagement.' },
  { q: 'How do I start earning?', a: 'Create a free account, browse available tasks, complete them following the instructions, and earn USDT rewards instantly.' },
  { q: 'What tasks are available?', a: 'Tasks include watching videos, liking posts, following pages, subscribing to channels, joining Telegram groups, visiting websites, surveys, and more.' },
  { q: 'How much can I earn?', a: 'Earnings vary by task type. Individual tasks pay 0.01-0.10 USDT. Active users earn $5-30+ daily depending on effort and VIP level.' },
  { q: 'How do withdrawals work?', a: 'Withdrawals are processed instantly to your USDT wallet. Minimum withdrawal is 1 USDT with low transaction fees.' },
  { q: 'Is EarnClicks safe?', a: 'Yes. We use advanced AI verification, anti-fraud systems, and secure encryption. Your data and earnings are fully protected.' },
  { q: 'How does the referral program work?', a: 'Earn 10% commission from Level 1 referrals, 5% from Level 2, and 2% from Level 3. Unlimited earning potential.' },
  { q: 'What is VIP membership?', a: 'VIP members enjoy higher rewards per task, priority access to new tasks, unlimited daily tasks, and reduced withdrawal fees.' },
  { q: 'How does AI verification work?', a: 'Our AI system automatically verifies task completion through screenshot analysis, pattern detection, and fraud prevention algorithms.' },
  { q: 'Can I use EarnClicks on mobile?', a: 'Yes! EarnClicks is fully responsive and works perfectly on all devices. A dedicated mobile app is coming soon.' },
];

const blogPosts = [
  { title: 'How to Maximize Your Earnings on EarnClicks', category: 'Guide', date: 'Jul 20, 2026', readTime: '5 min', image: 'gradient-blue' },
  { title: 'Top 10 Tasks That Pay the Most USDT', category: 'Earning Tips', date: 'Jul 18, 2026', readTime: '4 min', image: 'gradient-green' },
  { title: 'Launching Your First Ad Campaign: A Complete Guide', category: 'Advertising', date: 'Jul 15, 2026', readTime: '7 min', image: 'gradient-teal' },
];

const recentPayouts = [
  { user: 'User#8472', amount: '12.50', time: '2 min ago' },
  { user: 'User#3921', amount: '8.75', time: '5 min ago' },
  { user: 'User#5618', amount: '25.00', time: '8 min ago' },
  { user: 'User#1247', amount: '5.30', time: '12 min ago' },
  { user: 'User#7893', amount: '18.20', time: '15 min ago' },
  { user: 'User#2156', amount: '32.10', time: '18 min ago' },
];

export default function LandingPage() {
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [payoutIdx, setPayoutIdx] = useState(0);
  const [mobileNav, setMobileNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { logos, loading } = useSiteSettings();

  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setPayoutIdx((i) => (i + 1) % recentPayouts.length), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const scrollTo = (id: string) => {
    setMobileNav(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#F8FAFC]">

      {/* ───────────── HERO ───────────── */}
      <section id="hero" className="relative min-h-[100vh] flex items-center overflow-hidden" style={{ background: 'linear-gradient(160deg, #0F172A 0%, #131d3a 40%, #0F172A 100%)' }}>
        <div className="absolute inset-0 bg-grid-dark opacity-30" />
        <div className="absolute top-20 left-[10%] w-80 h-80 rounded-full bg-[#2D4F97]/15 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-20 right-[10%] w-72 h-72 rounded-full bg-[#18C97A]/10 blur-[100px] animate-pulse-slow" />
        <div className="absolute top-40 right-[20%] w-4 h-4 rounded-full bg-[#2D4F97] animate-float opacity-30" />
        <div className="absolute bottom-40 left-[15%] w-3 h-3 rounded-full bg-[#18C97A] animate-float-delayed opacity-30" />
        <div className="absolute top-60 left-[30%] w-2 h-2 rounded-full bg-[#1E8A8D] animate-float-slow opacity-20" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <Reveal>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#18C97A] animate-pulse" />
                  The #1 Social Task Marketplace
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1]">
                  Complete Social Media Tasks.
                  <br />
                  <span className="gradient-primary-text">Earn USDT Every Day.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
                  The world&apos;s fastest-growing Social Task &amp; Rewards Marketplace connecting advertisers with real users across 150+ countries.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="flex flex-wrap gap-4">
                  <Link href="/register">
                    <Button size="lg" className="gradient-primary text-white shadow-xl shadow-blue-900/30 hover:shadow-2xl hover:shadow-blue-900/40 transition-all duration-300 text-base px-8 py-6 h-auto rounded-xl font-semibold">
                      <Coins className="mr-2 h-5 w-5" /> Start Earning
                    </Button>
                  </Link>
                  <Link href="/register?role=advertiser">
                    <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 text-base px-8 py-6 h-auto rounded-xl font-semibold">
                      <Megaphone /> Create Campaign
                    </Button>
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={0.4}>
                <div className="flex flex-wrap gap-8 pt-4">
                  {[
                    { val: '250K+', label: 'Registered Users' },
                    { val: '1M+', label: 'Completed Tasks' },
                    { val: '500K+', label: 'USDT Paid' },
                    { val: '150+', label: 'Countries' },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="font-heading text-2xl font-bold text-white">{s.val}</div>
                      <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.3} className="hidden lg:block relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 rounded-3xl glass-card animate-float">
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                          <Wallet className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Total Balance</p>
                          <p className="text-white font-bold text-lg">12,450.80 USDT</p>
                        </div>
                      </div>
                      <span className="text-[#18C97A] text-xs font-medium bg-[#18C97A]/10 px-2 py-1 rounded-lg">+12.5%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { l: 'Today\'s Earnings', v: '28.45', c: '#18C97A' },
                        { l: 'Tasks Done', v: '145', c: '#2D4F97' },
                        { l: 'Referral Bonus', v: '8.20', c: '#1E8A8D' },
                        { l: 'Pending Tasks', v: '12', c: '#F59E0B' },
                      ].map((item) => (
                        <div key={item.l} className="rounded-xl bg-white/5 p-3">
                          <p className="text-[10px] text-gray-400">{item.l}</p>
                          <p className="text-white font-bold text-sm mt-1">{item.v}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {[
                        { n: 'Watch YouTube Video', r: '0.02 USDT', p: 'youtube' },
                        { n: 'Follow Instagram', r: '0.03 USDT', p: 'instagram' },
                        { n: 'Join Telegram', r: '0.02 USDT', p: 'telegram' },
                      ].map((t) => (
                        <div key={t.n} className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60">
                              {platformIcons[t.p]}
                            </div>
                            <span className="text-white text-xs font-medium">{t.n}</span>
                          </div>
                          <span className="text-[#18C97A] text-xs font-bold">{t.r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center shadow-lg animate-float-delayed">
                  <Coins className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-2xl bg-[#1E8A8D] flex items-center justify-center shadow-lg animate-float-slow">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────── LIVE EARNINGS TICKER ───────────── */}
      <section className="py-4 bg-[#0F172A] border-t border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-8">
          <span className="text-[#18C97A] text-xs font-semibold shrink-0 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#18C97A] animate-pulse" /> LIVE PAYOUTS
          </span>
          <div className="flex gap-8" style={{ animation: 'tickerScroll 20s linear infinite' }}>
            {recentPayouts.map((p, i) => (
              <div key={i} className="flex items-center gap-3 text-xs text-gray-400 shrink-0">
                <span className="text-white font-medium">{p.user}</span>
                <span className="text-[#18C97A] font-bold">{p.amount} USDT</span>
                <span className="text-gray-600">{p.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── CHOOSE YOUR ROLE ───────────── */}
      <section id="roles" className="py-24 lg:py-32 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #F8FAFC 0%, #eef2f7 100%)' }}>
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-[#2D4F97]/5 via-transparent to-[#18C97A]/5 blur-[200px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="Choose Your Journey" title="Pick How You Want to Use EarnClicks" subtitle="Whether you want to earn money or grow your business, EarnClicks has the perfect solution." light />
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* TASKER CARD */}
            <Reveal delay={0.1}>
              <div className="group relative rounded-3xl overflow-hidden" style={{ 
                background: 'linear-gradient(145deg, #2D4F97 0%, #1E8A8D 35%, #18C97A 100%)',
                boxShadow: '0 25px 80px rgba(45,79,151,0.25), 0 10px 30px rgba(0,0,0,0.1)'
              }}>
                <div className="absolute inset-0 bg-grid-dark opacity-10" />
                <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-white/5 blur-[150px] translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full bg-[#18C97A]/10 blur-[120px] -translate-x-1/2 translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10 p-8 lg:p-10">
                  {/* Header with icon & badge */}
                  <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 text-white/90 text-xs font-semibold mb-4">
                      <span className="w-2 h-2 rounded-full bg-[#18C97A] animate-pulse" />
                      Earn Money
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <Coins className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-heading text-3xl font-bold text-white mb-2">Become a Tasker</h3>
                    <p className="text-white/70 text-base leading-relaxed max-w-md">Complete simple social media tasks and receive instant USDT rewards. Start earning today with zero investment.</p>
                  </div>

                  {/* Stats Bar */}
                  <div className="grid grid-cols-3 gap-4 mb-8 p-4 rounded-2xl bg-white/10 border border-white/10">
                    {[
                      { label: 'Avg. Daily', value: '$15-50+', icon: <DollarSign className="h-5 w-5" /> },
                      { label: 'Task Types', value: '12+', icon: <Layers className="h-5 w-5" /> },
                      { label: 'Payout Time', value: 'Instant', icon: <Zap className="h-5 w-5" /> },
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className="flex items-center justify-center gap-1.5 text-white/80 text-sm mb-1">
                          <span style={{ color: stat.icon.props.color || '#18C97A' }}>{stat.icon}</span>
                        </div>
                        <div className="font-heading text-xl font-bold text-white">{stat.value}</div>
                        <div className="text-[10px] text-white/50 uppercase tracking-wider">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Feature Categories */}
                  <div className="space-y-5 mb-8">
                    {[
                      { 
                        title: 'Social Media Tasks', 
                        icon: <Globe className="h-5 w-5" />,
                        features: ['Watch YouTube Videos', 'Like Instagram Posts', 'Follow Twitter Accounts', 'Join Telegram Groups', 'Subscribe to Channels', 'Share & Retweet Content']
                      },
                      { 
                        title: 'Advanced Earnings', 
                        icon: <TrendingUp className="h-5 w-5" />,
                        features: ['Daily Login Bonuses', 'Streak Rewards (7/30 days)', 'VIP Multiplier (up to 2x)', 'Referral Program (3 Levels)', 'Leaderboard Prizes', 'Achievement Badges']
                      },
                      { 
                        title: 'Wallet & Security', 
                        icon: <Shield className="h-5 w-5" />,
                        features: ['Instant USDT Withdrawals', 'Multi-chain Support (TRC20/BEP20/ERC20)', 'AI Fraud Protection', '2FA Security', 'Transaction History', 'Tax Reports']
                      }
                    ].map((category, catIndex) => (
                      <div key={category.title} className="group/category">
                        <button 
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all duration-300 text-left"
                          onClick={() => {}}
                        >
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/20 text-white shrink-0 group-hover/category:scale-110 transition-transform">
                            {category.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-white text-sm">{category.title}</span>
                              <span className="text-white/50 text-xs">{category.features.length} features</span>
                            </div>
                            <p className="text-white/60 text-[11px] mt-0.5 truncate">{category.features.slice(0, 2).join(' • ')}...</p>
                          </div>
                          <span className="text-white/40">→</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap gap-3 mb-8 p-4 rounded-2xl bg-white/5 border border-white/10">
                    {[
                      { icon: <CheckCircle2 className="h-4 w-4" />, text: 'No Investment Required' },
                      { icon: <CheckCircle2 className="h-4 w-4" />, text: 'Instant Approval' },
                      { icon: <CheckCircle2 className="h-4 w-4" />, text: '24/7 Support' },
                      { icon: <CheckCircle2 className="h-4 w-4" />, text: 'Global Access' },
                    ].map((trust, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs">
                        {trust.icon} {trust.text}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link href="/register">
                    <Button className="w-full bg-white text-[#2D4F97] hover:bg-gray-100 font-semibold rounded-xl px-8 py-5 h-auto text-base shadow-xl group-hover:shadow-2xl transition-all group/btn">
                      Start Earning Now
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* ADVERTISER CARD */}
            <Reveal delay={0.2}>
              <div className="group relative rounded-3xl overflow-hidden" style={{ 
                background: 'linear-gradient(145deg, #0F172A 0%, #1E8A8D 40%, #18C97A 100%)',
                boxShadow: '0 25px 80px rgba(30,138,141,0.25), 0 10px 30px rgba(0,0,0,0.1)'
              }}>
                <div className="absolute inset-0 bg-grid-dark opacity-10" />
                <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-white/5 blur-[150px] translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full bg-[#1E8A8D]/15 blur-[120px] -translate-x-1/2 translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10 p-8 lg:p-10">
                  {/* Header with icon & badge */}
                  <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 text-white/90 text-xs font-semibold mb-4">
                      <span className="w-2 h-2 rounded-full bg-[#1E8A8D] animate-pulse" />
                      Grow Business
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <MegaphoneIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-heading text-3xl font-bold text-white mb-2">Become an Advertiser</h3>
                    <p className="text-white/70 text-base leading-relaxed max-w-md">Launch campaigns that generate genuine engagement across all major social media platforms. Real users, real results.</p>
                  </div>

                  {/* Stats Bar */}
                  <div className="grid grid-cols-3 gap-4 mb-8 p-4 rounded-2xl bg-white/10 border border-white/10">
                    {[
                      { label: 'Avg. ROI', value: '340%', icon: <BarChart3 className="h-5 w-5" /> },
                      { label: 'Platforms', value: '12+', icon: <Target className="h-5 w-5" /> },
                      { label: 'Setup Time', value: '< 5 min', icon: <Zap className="h-5 w-5" /> },
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className="flex items-center justify-center gap-1.5 text-white/80 text-sm mb-1">
                          <span>{stat.icon}</span>
                        </div>
                        <div className="font-heading text-xl font-bold text-white">{stat.value}</div>
                        <div className="text-[10px] text-white/50 uppercase tracking-wider">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Feature Categories */}
                  <div className="space-y-5 mb-8">
                    {[
                      { 
                        title: 'Campaign Types', 
                        icon: <Target className="h-5 w-5" />,
                        features: ['Follower Growth', 'Video Views', 'Channel Subscribers', 'Website Traffic', 'App Installs', 'Product Reviews', 'Custom Actions']
                      },
                      { 
                        title: 'Targeting & Optimization', 
                        icon: <Zap className="h-5 w-5" />,
                        features: ['Geo Targeting (150+ countries)', 'Interest-based Targeting', 'Demographic Filters', 'AI Audience Matching', 'A/B Testing', 'Auto-optimization']
                      },
                      { 
                        title: 'Analytics & Control', 
                        icon: <BarChart2 className="h-5 w-5" />,
                        features: ['Real-time Dashboard', 'Detailed Demographics', 'Engagement Quality Score', 'Fraud Detection Reports', 'API Access', 'White-label Options']
                      }
                    ].map((category, catIndex) => (
                      <div key={category.title} className="group/category">
                        <button 
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all duration-300 text-left"
                          onClick={() => {}}
                        >
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/20 text-white shrink-0 group-hover/category:scale-110 transition-transform">
                            {category.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-white text-sm">{category.title}</span>
                              <span className="text-white/50 text-xs">{category.features.length} features</span>
                            </div>
                            <p className="text-white/60 text-[11px] mt-0.5 truncate">{category.features.slice(0, 2).join(' • ')}...</p>
                          </div>
                          <span className="text-white/40">→</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap gap-3 mb-8 p-4 rounded-2xl bg-white/5 border border-white/10">
                    {[
                      { icon: <CheckCircle2 className="h-4 w-4" />, text: 'Real Human Traffic' },
                      { icon: <CheckCircle2 className="h-4 w-4" />, text: 'AI Quality Control' },
                      { icon: <CheckCircle2 className="h-4 w-4" />, text: 'Transparent Pricing' },
                      { icon: <CheckCircle2 className="h-4 w-4" />, text: 'Dedicated Support' },
                    ].map((trust, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs">
                        {trust.icon} {trust.text}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link href="/register?role=advertiser">
                    <Button className="w-full bg-white text-[#1E8A8D] hover:bg-gray-100 font-semibold rounded-xl px-8 py-5 h-auto text-base shadow-xl group-hover:shadow-2xl transition-all group/btn">
                      Create Campaign
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────── LIVE PLATFORM STATS ───────────── */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1a2744 100%)' }}>
        <div className="absolute inset-0 bg-grid-dark opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { v: 3842, l: 'Users Online', icon: <Users className="h-5 w-5" />, c: '#2D4F97' },
              { v: 28450, l: 'Today\'s Earnings (USDT)', icon: <DollarSign className="h-5 w-5" />, c: '#18C97A', p: '$' },
              { v: 1023, l: 'Active Campaigns', icon: <Target className="h-5 w-5" />, c: '#1E8A8D' },
              { v: 1245678, l: 'Tasks Completed', icon: <CheckCircle2 className="h-5 w-5" />, c: '#A78BFA' },
              { v: 45200, l: 'Withdrawals Today (USDT)', icon: <Wallet className="h-5 w-5" />, c: '#F59E0B', p: '$' },
            ].map((s, i) => (
              <Reveal key={s.l} delay={i * 0.1}>
                <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${s.c}20`, color: s.c }}>
                    {s.icon}
                  </div>
                  <div className="font-heading text-2xl lg:text-3xl font-bold text-white">
                    <CountUp end={s.v} prefix={s.p} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{s.l}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── HOW IT WORKS ───────────── */}
      <section id="how-it-works" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="How It Works" title="Start Earning in 6 Simple Steps" subtitle="From registration to receiving USDT, the process is quick and straightforward." light />
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { step: '01', title: 'Register', desc: 'Create free account', icon: <Users className="h-6 w-6" /> },
              { step: '02', title: 'Browse Tasks', desc: 'Find tasks you like', icon: <Search className="h-6 w-6" /> },
              { step: '03', title: 'Complete Task', desc: 'Follow instructions', icon: <Check className="h-6 w-6" /> },
              { step: '04', title: 'Upload Proof', desc: 'Submit screenshot', icon: <Upload className="h-6 w-6" /> },
              { step: '05', title: 'AI Verification', desc: 'Instant review', icon: <Brain className="h-6 w-6" /> },
              { step: '06', title: 'Receive USDT', desc: 'Earnings in wallet', icon: <Coins className="h-6 w-6" /> },
            ].map((s, i) => (
              <Reveal key={s.step} delay={i * 0.1}>
                <div className="text-center group">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform duration-300">
                      {s.icon}
                    </div>
                    {i < 5 && (
                      <div className="hidden lg:block absolute top-8 left-[55%] right-[-5%] h-0.5 bg-gradient-to-r from-blue-200 to-green-200" />
                    )}
                  </div>
                  <div className="font-heading text-4xl font-bold text-gray-100 mb-1">{s.step}</div>
                  <h3 className="font-heading font-bold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-xs text-gray-400">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── TASKER PROMOTION ───────────── */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2D4F97 0%, #1E8A8D 50%, #18C97A 100%)' }}>
        <div className="absolute inset-0 bg-grid-dark opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div className="space-y-6">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Earn Money<br />From Anywhere
                </h2>
                <p className="text-lg text-white/80 max-w-md">
                  Complete simple social media tasks and receive instant USDT rewards. No investment required.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['No Investment', 'Instant Payouts', 'Work Anytime', 'Global Access'].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-medium">{tag}</span>
                  ))}
                </div>
                <Link href="/register">
                  <Button size="lg" className="bg-white text-[#2D4F97] hover:bg-gray-100 font-semibold rounded-xl px-10 py-6 h-auto text-base shadow-xl mt-4">
                    Start Earning <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.2} className="hidden lg:flex justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 rounded-3xl glass-card flex items-center justify-center p-6">
                  <div className="w-full space-y-3">
                    {['Watch YouTube Video', 'Like Instagram Post', 'Follow Twitter Account', 'Join Telegram Group'].map((t, i) => (
                      <div key={t} className="bg-white/10 rounded-xl p-3 flex items-center justify-between">
                        <span className="text-white text-xs font-medium">{t}</span>
                        <span className="text-[#18C97A] text-xs font-bold">+{(0.01 + i * 0.01).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center animate-float">
                  <Coins className="h-7 w-7 text-white" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────── ADVERTISER PROMOTION ───────────── */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1a2744 50%, #0F172A 100%)' }}>
        <div className="absolute inset-0 bg-grid-dark opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal className="hidden lg:block">
              <div className="relative w-80 h-80 mx-auto">
                <div className="absolute inset-0 rounded-3xl glass-card flex items-center justify-center p-6">
                  <div className="w-full space-y-3">
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                      <p className="text-[#18C97A] text-xs font-medium">Campaign Performance</p>
                      <p className="text-white font-bold text-lg mt-1">+247% Engagement</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { l: 'Impressions', v: '1.2M' },
                        { l: 'Clicks', v: '45.8K' },
                        { l: 'Followers', v: '+8.4K' },
                        { l: 'ROI', v: '340%' },
                      ].map((m) => (
                        <div key={m.l} className="bg-white/5 rounded-xl p-3 text-center">
                          <p className="text-white font-bold text-sm">{m.v}</p>
                          <p className="text-gray-400 text-[10px] mt-0.5">{m.l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-2xl bg-[#18C97A]/20 flex items-center justify-center animate-float-delayed">
                  <BarChart3 className="h-7 w-7 text-[#18C97A]" />
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="space-y-6">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Grow Your Brand<br />With Real Users
                </h2>
                <p className="text-lg text-white/80 max-w-md">
                  Launch campaigns that generate genuine engagement across all major social media platforms.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['Real Engagement', 'AI Targeting', 'Fast Results', 'Low Cost'].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 rounded-full bg-[#18C97A]/15 text-[#18C97A] text-xs font-medium">{tag}</span>
                  ))}
                </div>
                <Link href="/register?role=advertiser">
                  <Button size="lg" className="gradient-primary text-white font-semibold rounded-xl px-10 py-6 h-auto text-base shadow-xl shadow-blue-900/20 mt-4">
                    Create Campaign <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────── SUPPORTED PLATFORMS ───────────── */}
      <section id="platforms" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="Supported Platforms" title="Tasks Across All Major Platforms" subtitle="Complete tasks on the platforms you already use and love." light />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {platformData.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.05}>
                <div className="group bg-white rounded-2xl p-6 text-center border border-gray-100 hover:border-transparent hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 card-hover cursor-default">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 transition-colors" style={{ background: `${p.color}12`, color: p.color }}>
                    <div className="h-7 w-7">{platformIcons[p.icon]}</div>
                  </div>
                  <h3 className="font-heading font-bold text-gray-900 text-sm mb-1">{p.name}</h3>
                  <p className="text-xs text-gray-400">{p.tasks} tasks</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── AVAILABLE TASKS ───────────── */}
      <section className="py-24 lg:py-32" style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1a2744 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="Task Categories" title="Explore Available Tasks" subtitle="Wide variety of tasks to match your skills and interests." />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {taskTypes.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.05}>
                <div className="group bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 card-hover cursor-default">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${t.color}20`, color: t.color }}>
                      {t.icon}
                    </div>
                    <span className="text-[#18C97A] text-sm font-bold">{t.reward}</span>
                  </div>
                  <h4 className="font-heading font-bold text-white text-sm mb-2">{t.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock3 className="h-3 w-3" /> {t.time}</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/5">{t.difficulty}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── LIVE TASK MARKETPLACE ───────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="Live Marketplace" title="Available Tasks Right Now" subtitle="Real-time tasks waiting for you to complete and earn." light />
          <Reveal>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-900/5 overflow-hidden">
              <div className="hidden sm:grid grid-cols-6 gap-4 p-5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <span className="col-span-2">Task</span>
                <span>Reward</span>
                <span>Country</span>
                <span>Progress</span>
                <span></span>
              </div>
              {liveTasks.map((t, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-6 gap-4 p-5 border-b border-gray-50 items-center hover:bg-gray-50/50 transition-colors">
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                      {platformIcons[t.platform]}
                    </div>
                    <span className="font-medium text-gray-900 text-sm">{t.task}</span>
                  </div>
                  <span className="text-[#18C97A] font-bold text-sm">{t.reward}</span>
                  <span className="text-gray-500 text-sm">{t.country}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full gradient-primary" style={{ width: `${(t.workers / t.slots) * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-400">{t.workers}/{t.slots}</span>
                  </div>
                  <Link href="/register" className="text-right">
                    <Button size="sm" variant="outline" className="text-xs border-gray-200 hover:bg-[#2D4F97] hover:text-white hover:border-[#2D4F97]">
                      Accept
                    </Button>
                  </Link>
                </div>
              ))}
              <div className="p-5 text-center">
                <Link href="/register" className="text-sm font-medium text-[#2D4F97] hover:text-[#1E8A8D] transition-colors inline-flex items-center gap-1">
                  View All Tasks <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── WHY EARNCLICKS ───────────── */}
      <section className="py-24 lg:py-32" style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1a2744 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="Why Choose Us" title="Built for Trust & Performance" subtitle="Every feature designed to maximize your earnings and protect your time." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'AI Verification', desc: 'Advanced AI detects fraud and ensures genuine engagement on every task.', icon: <Brain className="h-6 w-6" />, color: '#2D4F97' },
              { title: 'Anti Fraud', desc: 'Multi-layer protection against bots, fake accounts, and suspicious activity.', icon: <ShieldAlert className="h-6 w-6" />, color: '#1E8A8D' },
              { title: 'Instant Rewards', desc: 'Receive USDT instantly in your wallet upon task verification.', icon: <Zap className="h-6 w-6" />, color: '#18C97A' },
              { title: 'Fast Withdrawals', desc: 'Withdraw your earnings anytime with minimal fees and instant processing.', icon: <Wallet className="h-6 w-6" />, color: '#F59E0B' },
              { title: 'Referral Income', desc: 'Earn 10% from Level 1, 5% from Level 2, and 2% from Level 3 referrals.', icon: <Users className="h-6 w-6" />, color: '#A78BFA' },
              { title: 'VIP Membership', desc: 'Unlock higher rewards, priority tasks, and exclusive benefits.', icon: <Crown className="h-6 w-6" />, color: '#F59E0B' },
              { title: '24/7 Support', desc: 'Dedicated support team available around the clock via chat and email.', icon: <Headphones className="h-6 w-6" />, color: '#2D4F97' },
              { title: 'Global Community', desc: 'Join 250K+ users across 150+ countries earning on EarnClicks.', icon: <Globe className="h-6 w-6" />, color: '#18C97A' },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 card-hover group h-full">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:scale-110 transition-transform" style={{ background: `${f.color}15`, color: f.color }}>
                    {f.icon}
                  </div>
                  <h3 className="font-heading font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── AI VERIFICATION ───────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="AI Powered" title="Smart Task Verification" subtitle="Our AI system ensures every task is completed fairly and accurately." light />
          <Reveal>
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#2D4F97] via-[#1E8A8D] to-[#18C97A] hidden md:block" />
                <div className="space-y-8">
                  {[
                    { title: 'Task Completed', desc: 'You finish the social media task as instructed.', icon: <CheckCircle2 className="h-6 w-6" />, c: '#2D4F97' },
                    { title: 'Screenshot Upload', desc: 'Upload proof of completion via screenshot or link.', icon: <Upload className="h-6 w-6" />, c: '#1E8A8D' },
                    { title: 'AI Analysis', desc: 'Our AI instantly analyzes the submission for accuracy.', icon: <Brain className="h-6 w-6" />, c: '#18C97A' },
                    { title: 'Fraud Detection', desc: 'Multi-layer fraud checks ensure genuine engagement.', icon: <ShieldCheck className="h-6 w-6" />, c: '#2D4F97' },
                    { title: 'Manual Review', desc: 'Edge cases reviewed by our quality assurance team.', icon: <Eye className="h-6 w-6" />, c: '#1E8A8D' },
                    { title: 'Reward Released', desc: 'USDT instantly credited to your wallet.', icon: <Coins className="h-6 w-6" />, c: '#18C97A' },
                  ].map((step, i) => (
                    <Reveal key={step.title} delay={i * 0.1} className="flex gap-6 items-start">
                      <div className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg" style={{ background: `${step.c}20`, color: step.c }}>
                        {step.icon}
                      </div>
                      <div className="pt-3">
                        <h4 className="font-heading font-bold text-gray-900 text-lg">{step.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── VIP MEMBERSHIP ───────────── */}
      <section id="vip" className="py-24 lg:py-32 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1a2744 100%)' }}>
        <div className="absolute inset-0 bg-grid-dark opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="VIP Membership" title="Unlock Premium Rewards" subtitle="Upgrade your account for higher earnings, priority tasks, and exclusive benefits." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vipTiers.map((v, i) => (
              <Reveal key={v.name} delay={i * 0.1}>
                <div className={`relative rounded-2xl p-6 border transition-all duration-300 card-hover ${i === 3 ? 'border-[#F59E0B]/30 bg-gradient-to-b from-[#F59E0B]/10 to-transparent' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                  {i === 3 && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#F59E0B] text-black text-[10px] font-bold uppercase">Most Popular</span>
                  )}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${v.color}20`, color: v.color }}>
                    {v.icon}
                  </div>
                  <h3 className="font-heading font-bold text-white text-lg">{v.name}</h3>
                  <div className="mt-2 mb-4">
                    <span className="text-3xl font-heading font-bold text-white">{v.price}</span>
                    <span className="text-gray-500 text-xs ml-1">/ lifetime</span>
                  </div>
                  <div className="space-y-3 mb-6">
                    {[
                      { l: 'Reward Boost', v: v.reward },
                      { l: 'Daily Tasks', v: v.daily },
                      { l: 'Priority Support', v: 'Yes' },
                      { l: 'Early Access', v: i >= 2 ? 'Yes' : 'No' },
                    ].map((f) => (
                      <div key={f.l} className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">{f.l}</span>
                        <span className={`font-medium ${f.v === 'Yes' || f.v === 'No' ? (f.v === 'Yes' ? 'text-[#18C97A]' : 'text-gray-600') : 'text-white'}`}>{f.v}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/register">
                    <Button className={`w-full rounded-xl font-semibold ${i === 3 ? 'bg-[#F59E0B] text-black hover:bg-[#F59E0B]/90' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                      Upgrade to {v.name}
                    </Button>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── REFERRAL PROGRAM ───────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="Referral Program" title="Earn From Your Network" subtitle="Invite friends and earn commission from their activity across 3 levels." light />
          <Reveal>
            <div className="max-w-4xl mx-auto">
              <div className="relative rounded-3xl p-8 lg:p-12 overflow-hidden" style={{ background: 'linear-gradient(135deg, #2D4F97 0%, #1E8A8D 100%)' }}>
                <div className="absolute inset-0 bg-grid-dark opacity-10" />
                <div className="relative z-10 grid md:grid-cols-3 gap-8 text-center">
                  {[
                    { level: 'Level 1', pct: '10%', desc: 'Direct referrals', icon: <UserPlus className="h-8 w-8" />, c: '#18C97A' },
                    { level: 'Level 2', pct: '5%', desc: 'Indirect referrals', icon: <Users className="h-8 w-8" />, c: '#1E8A8D' },
                    { level: 'Level 3', pct: '2%', desc: 'Extended network', icon: <Network className="h-8 w-8" />, c: '#2D4F97' },
                  ].map((l, i) => (
                    <div key={l.level} className="space-y-4">
                      <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center" style={{ background: `${l.c}30`, color: l.c }}>
                        {l.icon}
                      </div>
                      <div>
                        <p className="text-white/60 text-sm font-medium">{l.level}</p>
                        <p className="text-4xl font-heading font-bold text-white mt-1">{l.pct}</p>
                        <p className="text-white/60 text-xs mt-1">{l.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="relative z-10 mt-10 text-center">
                  <p className="text-white/60 text-sm mb-4">Unlimited referrals. Unlimited earnings. Your network is your net worth.</p>
                  <Link href="/register">
                    <Button className="bg-white text-[#2D4F97] hover:bg-gray-100 font-semibold rounded-xl px-8 py-3 h-auto">
                      Start Referring <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── REWARD EXAMPLES ───────────── */}
      <section id="rewards" className="py-24 lg:py-32" style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1a2744 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="Rewards" title="What You Can Earn" subtitle="Every task has a clear reward. The more you do, the more you earn." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { action: 'YouTube Watch', reward: '0.02 USDT', icon: <Play className="h-5 w-5" />, c: '#FF0000' },
              { action: 'Facebook Like', reward: '0.01 USDT', icon: <ThumbsUp className="h-5 w-5" />, c: '#1877F2' },
              { action: 'Instagram Follow', reward: '0.03 USDT', icon: <UserPlus className="h-5 w-5" />, c: '#E4405F' },
              { action: 'TikTok Like', reward: '0.015 USDT', icon: <Heart className="h-5 w-5" />, c: '#000000' },
              { action: 'Write Comment', reward: '0.04 USDT', icon: <MessageCircle className="h-5 w-5" />, c: '#1DA1F2' },
              { action: 'Share Post', reward: '0.035 USDT', icon: <Share2 className="h-5 w-5" />, c: '#1877F2' },
            ].map((r, i) => (
              <Reveal key={r.action} delay={i * 0.08}>
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all card-hover">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${r.c}20`, color: r.c }}>
                    {r.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white text-sm">{r.action}</p>
                    <p className="text-xs text-gray-500">Per task</p>
                  </div>
                  <span className="text-[#18C97A] font-bold text-sm">{r.reward}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── SUCCESS STORIES ───────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="Success Stories" title="Trusted by Thousands" subtitle="Hear from real users who are earning on EarnClicks every day." light />
          <Reveal>
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-900/5 p-8 lg:p-10 text-center">
                <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                  {testimonials[testimonialIdx].name.charAt(0)}
                </div>
                <div className="flex items-center justify-center gap-1 mb-3">
                  {[...Array(testimonials[testimonialIdx].rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-[#F59E0B] fill-[#F59E0B]" />
                  ))}
                </div>
                <p className="text-gray-600 text-lg italic mb-6 leading-relaxed">&quot;{testimonials[testimonialIdx].text}&quot;</p>
                <div>
                  <p className="font-heading font-bold text-gray-900">{testimonials[testimonialIdx].name}</p>
                  <p className="text-sm text-gray-400">{testimonials[testimonialIdx].country} {testimonials[testimonialIdx].flag} · Earning {testimonials[testimonialIdx].amount}</p>
                </div>
                <div className="flex items-center justify-center gap-2 mt-6">
                  {testimonials.map((_, i) => (
                    <button key={i} onClick={() => setTestimonialIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === testimonialIdx ? 'gradient-primary w-6' : 'bg-gray-200'}`} />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── GLOBAL MAP (simplified) ───────────── */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1a2744 100%)' }}>
        <div className="absolute inset-0 bg-grid-dark opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading badge="Global Reach" title="Worldwide Presence" subtitle="Connecting advertisers and taskers across every continent." />
          <Reveal>
            <div className="relative max-w-4xl mx-auto">
              <div className="w-full aspect-[2/1] rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 opacity-30">
                  <svg viewBox="0 0 1000 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="500" cy="250" rx="450" ry="200" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <ellipse cx="500" cy="250" rx="300" ry="130" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <ellipse cx="500" cy="250" rx="150" ry="65" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <line x1="50" y1="250" x2="950" y2="250" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="500" y1="50" x2="500" y2="450" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  </svg>
                </div>
                {[
                  { x: '25%', y: '35%', label: '150+ Countries' },
                  { x: '55%', y: '30%', label: '250K+ Users' },
                  { x: '75%', y: '45%', label: '500K+ USDT Paid' },
                  { x: '40%', y: '55%', label: '1M+ Tasks Done' },
                ].map((p, i) => (
                  <div key={i} className="absolute animate-pulse" style={{ left: p.x, top: p.y }}>
                    <div className="w-3 h-3 rounded-full bg-[#18C97A] shadow-lg shadow-[#18C97A]/50" />
                  </div>
                ))}
                <div className="relative z-10 p-8 text-center">
                  <p className="text-white/40 text-sm">Trusted across the globe</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {[
                  { v: '150+', l: 'Countries', icon: <Globe className="h-5 w-5" /> },
                  { v: '250K+', l: 'Users', icon: <Users className="h-5 w-5" /> },
                  { v: '1M+', l: 'Tasks Done', icon: <CheckCircle2 className="h-5 w-5" /> },
                  { v: '500K+', l: 'USDT Paid', icon: <Coins className="h-5 w-5" /> },
                ].map((s) => (
                  <div key={s.l} className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[#18C97A] mx-auto mb-2">{s.icon}</div>
                    <p className="font-heading font-bold text-white text-lg">{s.v}</p>
                    <p className="text-xs text-gray-400">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── MOBILE APP ───────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2D4F97]/10 text-[#2D4F97] text-xs font-semibold">
                  <Smartphone className="h-3.5 w-3.5" /> Mobile App
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Earn on the Go
                </h2>
                <p className="text-lg text-gray-500 max-w-md">
                  Download our mobile app and start earning USDT from anywhere. Available on iOS and Android.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800 font-semibold rounded-xl px-6 py-5 h-auto">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                    App Store
                  </Button>
                  <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800 font-semibold rounded-xl px-6 py-5 h-auto">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>
                    Google Play
                  </Button>
                </div>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock3 className="h-3 w-3" /> Coming soon — join the waitlist
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2} className="flex justify-center">
              <div className="relative w-64 h-[500px]">
                <div className="absolute inset-0 rounded-[2.5rem] bg-gray-900 border-4 border-gray-700 shadow-2xl overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-900 rounded-b-2xl z-10" />
                  <div className="w-full h-full p-4 pt-8" style={{ background: 'linear-gradient(180deg, #0F172A, #1a2744)' }}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg gradient-primary" />
                        <span className="text-white font-bold text-xs">EarnClicks</span>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3">
                        <p className="text-gray-400 text-[10px]">Balance</p>
                        <p className="text-white font-bold text-sm">1,245.80 USDT</p>
                      </div>
                      {['Watch Video (+0.02)', 'Like Post (+0.01)', 'Follow (+0.03)', 'Join Group (+0.02)'].map((t) => (
                        <div key={t} className="bg-white/5 rounded-xl p-2.5 flex items-center justify-between">
                          <span className="text-white text-[10px]">{t}</span>
                          <span className="text-[#18C97A] text-[10px] font-bold">Start</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg animate-float">
                  <Coins className="h-6 w-6 text-white" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────── FAQ ───────────── */}
      <section id="faq" className="py-24 lg:py-32" style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1a2744 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="FAQ" title="Frequently Asked Questions" subtitle="Everything you need to know about EarnClicks." />
          <div className="space-y-3">
            {faqData.map((faq, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-5 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-medium text-white text-sm pr-4">{faq.q}</span>
                    {openFaq === i ? <Minus className="h-4 w-4 text-gray-400 shrink-0" /> : <Plus className="h-4 w-4 text-gray-400 shrink-0" />}
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="px-5 pb-5 text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── BLOG ───────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="Blog" title="Latest from EarnClicks" subtitle="Tips, guides, and news to help you earn more and grow faster." light />
          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => (
              <Reveal key={post.title} delay={i * 0.1}>
                <Link href="/blog" className="group block">
                  <div className={`rounded-3xl p-6 h-48 flex flex-col justify-end relative overflow-hidden ${i === 0 ? 'bg-gradient-to-br from-[#2D4F97] to-[#1E8A8D]' : i === 1 ? 'bg-gradient-to-br from-[#1E8A8D] to-[#18C97A]' : 'bg-gradient-to-br from-[#0F172A] to-[#2D4F97]'}`}>
                    <div className="absolute inset-0 bg-grid-dark opacity-10" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-medium">{post.category}</span>
                        <span className="text-white/50 text-[10px]">{post.readTime}</span>
                      </div>
                      <h3 className="font-heading font-bold text-white text-lg leading-tight group-hover:underline">{post.title}</h3>
                      <p className="text-white/50 text-xs mt-2">{post.date}</p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── NEWSLETTER ───────────── */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">Stay Updated</h2>
            <p className="text-sm text-gray-500 mb-6">Get the latest news, tips, and exclusive rewards delivered to your inbox.</p>
            <form className="flex max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" className="flex-1 bg-white border border-gray-200 rounded-l-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#2D4F97] focus:ring-1 focus:ring-[#2D4F97]" />
              <Button type="submit" className="gradient-primary text-white rounded-r-xl px-6 font-semibold rounded-l-none">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ───────────── FINAL CTA ───────────── */}
      <section className="relative py-32 overflow-hidden" style={{ background: 'linear-gradient(135deg, #2D4F97 0%, #1E8A8D 50%, #18C97A 100%)' }}>
        <div className="absolute inset-0 bg-grid-dark opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute top-20 left-[15%] w-4 h-4 rounded-full bg-white/20 animate-float" />
        <div className="absolute bottom-20 right-[20%] w-3 h-3 rounded-full bg-white/20 animate-float-delayed" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Start?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join 250,000+ users earning USDT. Choose your path and start today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-white text-[#2D4F97] hover:bg-gray-100 font-semibold shadow-xl hover:shadow-2xl transition-all text-base px-10 py-6 h-auto rounded-xl">
                  <Coins className="mr-2 h-5 w-5" /> Become a Tasker
                </Button>
              </Link>
              <Link href="/register?role=advertiser">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white transition-all text-base px-10 py-6 h-auto rounded-xl">
                  <MegaphoneIcon className="mr-2 h-5 w-5" /> Become an Advertiser
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function MegaphoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-5v12L3 13v-2z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}

function Megaphone({ className }: { className?: string }) {
  return <MegaphoneIcon className={className} />;
}
