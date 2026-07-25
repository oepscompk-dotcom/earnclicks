'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Search, ArrowRight, Zap, Target, Gift, Star, BookOpen, Users, BarChart3, MessageSquare, HelpCircle, Play, Trophy, TrendingUp, Globe, Coins, Shield, LogOut, User, LayoutDashboard, Settings } from 'lucide-react';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { LogoImage } from '@/components/ui/logo-image';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Earn Money', href: '/register?role=user', hasMega: 'earn' as const },
  { label: 'Advertise', href: '/register?role=advertiser', hasMega: 'advertise' as const },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Rewards', href: '/#rewards' },
  { label: 'VIP', href: '/#vip' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/contact' },
];

const earnMega = [
  { title: 'Get Started', items: [
    { label: 'Available Tasks', href: '/dashboard/tasks', icon: <Play className="h-5 w-5" />, desc: 'Browse & complete tasks' },
    { label: 'Task Categories', href: '/#platforms', icon: <Target className="h-5 w-5" />, desc: 'Explore all categories' },
    { label: 'Reward Rates', href: '/#rewards', icon: <TrendingUp className="h-5 w-5" />, desc: 'See earning potential' },
    { label: 'Daily Bonuses', href: '/#rewards', icon: <Gift className="h-5 w-5" />, desc: 'Extra daily rewards' },
  ]},
  { title: 'Grow', items: [
    { label: 'VIP Levels', href: '/#vip', icon: <Star className="h-5 w-5" />, desc: 'Unlock higher rewards' },
    { label: 'Referral Program', href: '/#referral', icon: <Users className="h-5 w-5" />, desc: 'Earn from invites' },
    { label: 'Leaderboard', href: '/#leaderboard', icon: <Trophy className="h-5 w-5" />, desc: 'Top earners ranking' },
  ]},
  { title: 'Learn', items: [
    { label: 'How It Works', href: '/#how-it-works', icon: <BookOpen className="h-5 w-5" />, desc: 'Step-by-step guide' },
    { label: 'Help Center', href: '/support', icon: <HelpCircle className="h-5 w-5" />, desc: 'Get support' },
    { label: 'Community', href: '/contact', icon: <MessageSquare className="h-5 w-5" />, desc: 'Join our community' },
  ]},
];

const advertiseMega = [
  { title: 'Campaign', items: [
    { label: 'Create Campaign', href: '/register?role=advertiser', icon: <Zap className="h-5 w-5" />, desc: 'Launch your campaign' },
    { label: 'Campaign Types', href: '/#pricing', icon: <Target className="h-5 w-5" />, desc: 'Explore formats' },
    { label: 'Pricing', href: '/#pricing', icon: <BarChart3 className="h-5 w-5" />, desc: 'View pricing plans' },
  ]},
  { title: 'Optimize', items: [
    { label: 'Analytics', href: '/advertiser/analytics', icon: <BarChart3 className="h-5 w-5" />, desc: 'Track performance' },
    { label: 'API Access', href: '/api-docs', icon: <Zap className="h-5 w-5" />, desc: 'Integrate with us' },
    { label: 'Enterprise', href: '/enterprise', icon: <Star className="h-5 w-5" />, desc: 'Large-scale solutions' },
  ]},
  { title: 'Resources', items: [
    { label: 'Help Center', href: '/support', icon: <HelpCircle className="h-5 w-5" />, desc: 'Get help' },
    { label: 'Documentation', href: '/api-docs', icon: <BookOpen className="h-5 w-5" />, desc: 'Read the docs' },
    { label: 'Support', href: '/contact', icon: <MessageSquare className="h-5 w-5" />, desc: 'Contact us' },
  ]},
];

function DefaultLogo() {
  return (
    <svg viewBox="0 0 200 48" className="h-9 w-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hdr" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2D4F97" />
          <stop offset="50%" stopColor="#1E8A8D" />
          <stop offset="100%" stopColor="#18C97A" />
        </linearGradient>
      </defs>
      <text x="0" y="36" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontSize="36" fill="url(#hdr)" letterSpacing="-1">EarnClicks</text>
    </svg>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<'earn' | 'advertise' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const searchRef = useRef<HTMLDivElement>(null);
  const signInRef = useRef<HTMLDivElement>(null);
  const signUpRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { logos, loading } = useSiteSettings();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (signInRef.current && !signInRef.current.contains(e.target as Node)) setSignInOpen(false);
      if (signUpRef.current && !signUpRef.current.contains(e.target as Node)) setSignUpOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/dashboard/tasks?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleMegaEnter = (type: 'earn' | 'advertise') => {
    clearTimeout(megaTimeoutRef.current);
    setActiveMega(type);
  };

  const handleMegaLeave = () => {
    megaTimeoutRef.current = setTimeout(() => setActiveMega(null), 150);
  };

  const authDropdowns = (
    <>
      <div className="relative" ref={signInRef}>
        <button
          onClick={() => { setSignInOpen(!signInOpen); setSignUpOpen(false); setSearchOpen(false); }}
          className="hidden md:inline-flex px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-[#2D4F97] hover:bg-gray-100 rounded-xl transition-all duration-200 flex items-center gap-1"
        >
          Sign In <ChevronDown className="h-4 w-4" />
        </button>
        {signInOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-900/10 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
            <Link
              href="/tasker-login"
              className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#2D4F97] rounded-xl transition-colors flex items-center gap-3"
              onClick={() => setSignInOpen(false)}
            >
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Coins className="h-4 w-4" />
              </div>
              <span>Tasker Login</span>
            </Link>
            <Link
              href="/advertiser-login"
              className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#2D4F97] rounded-xl transition-colors flex items-center gap-3"
              onClick={() => setSignInOpen(false)}
            >
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                <MegaphoneIcon className="h-4 w-4" />
              </div>
              <span>Advertiser Login</span>
            </Link>
          </div>
        )}
      </div>

      <div className="relative" ref={signUpRef}>
        <button
          onClick={() => { setSignUpOpen(!signUpOpen); setSignInOpen(false); setSearchOpen(false); }}
          className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-[#2D4F97] via-[#1E8A8D] to-[#18C97A] text-white rounded-xl px-6 py-2.5 text-sm font-semibold hover:opacity-90 hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-200"
        >
          Sign Up <ChevronDown className="h-4 w-4" />
        </button>
        {signUpOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-900/10 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
            <Link
              href="/tasker-register"
              className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#2D4F97] rounded-xl transition-colors flex items-center gap-3"
              onClick={() => setSignUpOpen(false)}
            >
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Coins className="h-4 w-4" />
              </div>
              <span>Become a Tasker</span>
            </Link>
            <Link
              href="/advertiser-register"
              className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#2D4F97] rounded-xl transition-colors flex items-center gap-3"
              onClick={() => setSignUpOpen(false)}
            >
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                <MegaphoneIcon className="h-4 w-4" />
              </div>
              <span>Become an Advertiser</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );

  const userMenu = (
    <div className="relative" ref={userMenuRef}>
      <button
        onClick={() => { setUserMenuOpen(!userMenuOpen); setSearchOpen(false); }}
        className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#2D4F97] hover:bg-gray-100 rounded-xl transition-all duration-200"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#2D4F97] to-[#18C97A] flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <span className="hidden sm:inline">{user?.name}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      {userMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-900/10 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
          <Link
            href={user?.role === 'admin' ? '/admin' : user?.role === 'advertiser' ? '/advertiser' : '/dashboard'}
            className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#2D4F97] rounded-xl transition-colors flex items-center gap-3"
            onClick={() => setUserMenuOpen(false)}
          >
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <span>Dashboard</span>
          </Link>
          <Link
            href="/dashboard/profile"
            className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#2D4F97] rounded-xl transition-colors flex items-center gap-3"
            onClick={() => setUserMenuOpen(false)}
          >
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <span>Profile</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#2D4F97] rounded-xl transition-colors flex items-center gap-3"
            onClick={() => setUserMenuOpen(false)}
          >
            <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
              <Settings className="h-4 w-4" />
            </div>
            <span>Settings</span>
          </Link>
          <hr className="my-2 border-gray-100" />
          <button
            onClick={async () => { await logout(); setUserMenuOpen(false); }}
            className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <LogOut className="h-4 w-4" />
            </div>
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="h-8 gradient-primary flex items-center justify-between px-4 text-white text-[11px] font-medium relative z-[60]">
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">Welcome to EarnClicks</span>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span>Complete Social Media Tasks</span>
          <span className="opacity-60">•</span>
          <span>Earn USDT</span>
          <span className="opacity-60">•</span>
          <span>Promote Your Business</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5">
            <Globe className="h-3 w-3" />
            150+ Countries
          </span>
          <span className="hidden lg:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Platform Online
          </span>
        </div>
      </div>

      <header className={cn(
        'sticky top-0 z-50 h-14 flex items-center transition-all duration-300',
        scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-lg shadow-gray-900/5' : 'bg-white/60 backdrop-blur-md'
      )}>
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            {loading ? <DefaultLogo /> : (
              <LogoImage src={logos.header_logo} type={logos.header_logo_type} alt="EarnClicks" defaultLogo={<DefaultLogo />} />
            )}
            <div className="hidden sm:flex flex-col">
              <span className="font-heading font-bold text-lg leading-tight gradient-primary-text">{logos.site_name || 'EarnClicks'}</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5" ref={megaRef}>
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasMega && handleMegaEnter(item.hasMega)}
                onMouseLeave={() => item.hasMega && handleMegaLeave()}
              >
                <Link
                  href={item.href}
                  className="relative px-3 py-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors group flex items-center gap-1"
                  onClick={() => setActiveMega(null)}
                >
                  {item.label}
                  {item.hasMega && <ChevronDown className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#2D4F97] to-[#18C97A] group-hover:w-full transition-all duration-300 rounded-full" />
                </Link>
              </div>
            ))}

            {activeMega && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50"
                onMouseEnter={() => handleMegaEnter(activeMega)}
                onMouseLeave={handleMegaLeave}
              >
                <div className="bg-white rounded-2xl shadow-2xl shadow-gray-900/10 border border-gray-100 p-6 min-w-[640px] grid grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-200">
                  {(activeMega === 'earn' ? earnMega : advertiseMega).map((col) => (
                    <div key={col.title}>
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">{col.title}</p>
                      {col.items.map((mi) => (
                        <Link
                          key={mi.label}
                          href={mi.href}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group/item"
                          onClick={() => setActiveMega(null)}
                        >
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center gradient-primary text-white shadow-md shadow-blue-900/10 shrink-0 group-hover/item:scale-110 transition-transform">
                            {mi.icon}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 group-hover/item:gradient-primary-text transition-colors">{mi.label}</p>
                            <p className="text-xs text-gray-400 truncate">{mi.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <div className="relative" ref={searchRef}>
              <form onSubmit={handleSearch} className="flex items-center">
                <div className={`relative flex items-center transition-all duration-300 ease-out ${
                  searchOpen ? 'w-72 md:w-96 opacity-100 visible' : 'w-10 md:w-10 opacity-0 invisible'
                }`}>
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search tasks, campaigns, users..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchOpen(true)}
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-gray-100 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2D4F97]/20 focus:border-[#2D4F97] transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className={`ml-2 p-2.5 rounded-xl transition-all duration-300 ${
                    searchOpen ? 'bg-gradient-to-r from-[#2D4F97] to-[#18C97A] text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                  aria-label="Search"
                >
                  <Search className="h-4.5 w-4.5" />
                </button>
              </form>
            </div>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => { setUserMenuOpen(!userMenuOpen); setSearchOpen(false); }}
                  className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#2D4F97] hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#2D4F97] to-[#18C97A] flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
<span className="hidden sm:inline">{user?.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-900/10 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <Link
href={user?.role === 'admin' ? '/admin' : user?.role === 'advertiser' ? '/advertiser' : '/dashboard'}
                      className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#2D4F97] rounded-xl transition-colors flex items-center gap-3"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                        <LayoutDashboard className="h-4 w-4" />
                      </div>
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#2D4F97] rounded-xl transition-colors flex items-center gap-3"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#2D4F97] rounded-xl transition-colors flex items-center gap-3"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
                        <Settings className="h-4 w-4" />
                      </div>
                      <span>Settings</span>
                    </Link>
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={async () => { await logout(); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                        <LogOut className="h-4 w-4" />
                      </div>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="relative" ref={signInRef}>
                  <button
                    onClick={() => { setSignInOpen(!signInOpen); setSignUpOpen(false); setSearchOpen(false); }}
                    className="hidden md:inline-flex px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-[#2D4F97] hover:bg-gray-100 rounded-xl transition-all duration-200 flex items-center gap-1"
                  >
                    Sign In <ChevronDown className="h-4 w-4" />
                  </button>
                  {signInOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-900/10 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <Link
                        href="/tasker-login"
                        className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#2D4F97] rounded-xl transition-colors flex items-center gap-3"
                        onClick={() => setSignInOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                          <Coins className="h-4 w-4" />
                        </div>
                        <span>Tasker Login</span>
                      </Link>
                      <Link
                        href="/advertiser-login"
                        className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#2D4F97] rounded-xl transition-colors flex items-center gap-3"
                        onClick={() => setSignInOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                          <MegaphoneIcon className="h-4 w-4" />
                        </div>
                        <span>Advertiser Login</span>
                      </Link>
                    </div>
                  )}
                </div>

                <div className="relative" ref={signUpRef}>
                  <button
                    onClick={() => { setSignUpOpen(!signUpOpen); setSignInOpen(false); setSearchOpen(false); }}
                    className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-[#2D4F97] via-[#1E8A8D] to-[#18C97A] text-white rounded-xl px-6 py-2.5 text-sm font-semibold hover:opacity-90 hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-200"
                  >
                    Sign Up <ChevronDown className="h-4 w-4" />
                  </button>
                  {signUpOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-900/10 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <Link
                        href="/tasker-register"
                        className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#2D4F97] rounded-xl transition-colors flex items-center gap-3"
                        onClick={() => setSignUpOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                          <Coins className="h-4 w-4" />
                        </div>
                        <span>Become a Tasker</span>
                      </Link>
                      <Link
                        href="/advertiser-register"
                        className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#2D4F97] rounded-xl transition-colors flex items-center gap-3"
                        onClick={() => setSignUpOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                          <MegaphoneIcon className="h-4 w-4" />
                        </div>
                        <span>Become an Advertiser</span>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
            <button className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-80 bg-white shadow-2xl flex flex-col animate-slide-in-left">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <span className="font-heading font-bold text-lg gradient-primary-text">{logos.site_name || 'EarnClicks'}</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#2D4F97] rounded-xl transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-100 space-y-2">
              {user ? (
                <div className="space-y-2">
                  <Link
                    href={user.role === 'admin' ? '/admin' : user.role === 'advertiser' ? '/advertiser' : '/dashboard'}
                    className="block w-full text-center px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={async () => { await logout(); setMobileOpen(false); }}
                    className="block w-full text-center px-4 py-3 text-red-600 font-medium hover:text-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/tasker-login" className="block w-full text-center px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setMobileOpen(false)}>
                    Login
                  </Link>
                  <Link href="/register" className="block w-full text-center gradient-primary text-white rounded-xl px-4 py-3 text-sm font-medium hover:opacity-90 transition-opacity" onClick={() => setMobileOpen(false)}>
                    Start Earning
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MegaphoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-5v12L3 13v-2z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}