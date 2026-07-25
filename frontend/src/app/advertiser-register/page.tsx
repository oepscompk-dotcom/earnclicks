'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2, User, Mail, Phone, MapPin, Calendar, Globe, Lock, Shield, Zap, Coins, Users, TrendingUp, Award, Star, Gift, CheckCircle2, ChevronDown, ArrowRight, Send, Globe as GlobeIcon, Smartphone, Heart, MessageCircle, Share2, UserPlus, ThumbsUp, Twitter, Instagram, Youtube, Facebook, Music, Gamepad2, Linkedin, Download, Sparkles, Zap as ZapIcon, Play, CreditCard, Bitcoin, Banknote, CircleDollarSign, Minus, Plus, Clock3, Camera, Wallet, Megaphone, BarChart3, Target, MousePointer2, Activity, LineChart, PieChart } from 'lucide-react';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { LogoImage } from '@/components/ui/logo-image';
import { countries, languages, getCountryByCode } from '@/data/countries';

const timezones = [
  { value: 'UTC-12:00', label: '(UTC-12:00) International Date Line West' },
  { value: 'UTC-11:00', label: '(UTC-11:00) Midway Island, Samoa' },
  { value: 'UTC-10:00', label: '(UTC-10:00) Hawaii' },
  { value: 'UTC-09:00', label: '(UTC-09:00) Alaska' },
  { value: 'UTC-08:00', label: '(UTC-08:00) Pacific Time (US & Canada)' },
  { value: 'UTC-07:00', label: '(UTC-07:00) Mountain Time (US & Canada)' },
  { value: 'UTC-06:00', label: '(UTC-06:00) Central Time (US & Canada)' },
  { value: 'UTC-05:00', label: '(UTC-05:00) Eastern Time (US & Canada)' },
  { value: 'UTC-04:00', label: '(UTC-04:00) Atlantic Time (Canada)' },
  { value: 'UTC-03:00', label: '(UTC-03:00) Buenos Aires, Georgetown' },
  { value: 'UTC-02:00', label: '(UTC-02:00) Mid-Atlantic' },
  { value: 'UTC-01:00', label: '(UTC-01:00) Azores, Cape Verde' },
  { value: 'UTC+00:00', label: '(UTC+00:00) London, Dublin, Casablanca' },
  { value: 'UTC+01:00', label: '(UTC+01:00) Berlin, Paris, Rome' },
  { value: 'UTC+02:00', label: '(UTC+02:00) Cairo, Istanbul, Kyiv' },
  { value: 'UTC+03:00', label: '(UTC+03:00) Moscow, Riyadh, Nairobi' },
  { value: 'UTC+04:00', label: '(UTC+04:00) Dubai, Abu Dhabi, Baku' },
  { value: 'UTC+05:00', label: '(UTC+05:00) Karachi, Tashkent' },
  { value: 'UTC+05:30', label: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi' },
  { value: 'UTC+06:00', label: '(UTC+06:00) Dhaka, Almaty' },
  { value: 'UTC+07:00', label: '(UTC+07:00) Bangkok, Hanoi, Jakarta' },
  { value: 'UTC+08:00', label: '(UTC+08:00) Beijing, Hong Kong, Singapore, Manila' },
  { value: 'UTC+09:00', label: '(UTC+09:00) Seoul, Tokyo, Osaka' },
  { value: 'UTC+10:00', label: '(UTC+10:00) Sydney, Melbourne, Brisbane' },
  { value: 'UTC+11:00', label: '(UTC+11:00) Solomon Islands, New Caledonia' },
  { value: 'UTC+12:00', label: '(UTC+12:00) Auckland, Wellington, Fiji' },
];

const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const networks = [
  { value: 'TRC20', label: 'TRC20 (Tron)', color: '#FF6B35' },
  { value: 'BEP20', label: 'BEP20 (BSC)', color: '#F0B90B' },
  { value: 'ERC20', label: 'ERC20 (Ethereum)', color: '#627EEA' },
];

const platformIcons = [
  { name: 'Facebook', icon: <Facebook className="h-6 w-6" />, color: '#1877F2' },
  { name: 'Instagram', icon: <Instagram className="h-6 w-6" />, color: '#E4405F' },
  { name: 'YouTube', icon: <Youtube className="h-6 w-6" />, color: '#FF0000' },
  { name: 'TikTok', icon: <Music className="h-6 w-6" />, color: '#000000' },
  { name: 'Telegram', icon: <Send className="h-6 w-6" />, color: '#26A5E4' },
  { name: 'Discord', icon: <Gamepad2 className="h-6 w-6" />, color: '#5865F2' },
  { name: 'LinkedIn', icon: <Linkedin className="h-6 w-6" />, color: '#0A66C2' },
  { name: 'Twitter / X', icon: <Twitter className="h-6 w-6" />, color: '#1DA1F2' },
];

export default function AdvertiserRegisterPage() {
  const [formData, setFormData] = useState({
    avatar: '',
    name: '',
    username: '',
    email: '',
    phone: '',
    country: 'US',
    state: '',
    city: '',
    dob: '',
    gender: 'male',
    language: 'en',
    timezone: 'UTC+00:00',
    referral_code: '',
    password: '',
    confirmPassword: '',
    walletCurrency: 'USDT',
    network: 'TRC20',
    terms: false,
    recaptcha: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const { register } = useAuth();
  const router = useRouter();
  const { logos } = useSiteSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.terms) {
      setError('You must accept the Terms & Conditions');
      return;
    }
    if (!formData.recaptcha) {
      setError('Please verify you are not a robot');
      return;
    }
    setLoading(true);
    try {
      await register({ ...formData, role: 'advertiser' });
      router.push('/advertiser');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCountryChange = (code: string) => {
    const country = countries.find(c => c.code === code);
    setSelectedCountry(country || countries[0]);
    setFormData(prev => ({ ...prev, country: code, state: '', city: '', phone: `${country?.phoneCode || '+1'} ` }));
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Left Section - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 flex-col relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E8A8D 50%, #18C97A 100%)' }}>
        <div className="absolute inset-0 bg-grid-dark opacity-20" />
        <div className="absolute top-20 left-[10%] w-80 h-80 rounded-full bg-white/5 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-20 right-[10%] w-72 h-72 rounded-full bg-white/5 blur-[100px] animate-pulse-slow" />
        <div className="absolute top-40 right-[15%] w-6 h-6 rounded-full bg-white/10 animate-float" />
        <div className="absolute bottom-40 left-[20%] w-4 h-4 rounded-full bg-white/10 animate-float-delayed" />
        <div className="absolute top-60 left-[30%] w-3 h-3 rounded-full bg-white/10 animate-float-slow" />

        {/* Floating Platform Icons */}
        {platformIcons.map((p, i) => (
          <div key={p.name} className="absolute animate-float" style={{
            left: `${8 + (i % 4) * 20}%`,
            top: `${10 + Math.floor(i / 4) * 35}%`,
            animationDelay: `${i * 0.4}s`
          }}>
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10" style={{ boxShadow: `0 8px 32px ${p.color}30` }}>
              <div className="h-9 w-9">{p.icon}</div>
            </div>
          </div>
        ))}

        <div className="relative z-10 flex-1 flex flex-col p-8 lg:p-16">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            {logos.header_logo ? (
              <LogoImage src={logos.header_logo} type={logos.header_logo_type || 'png'} alt="EarnClicks" className="h-12 w-auto" defaultLogo={null} />
            ) : (
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#1E8A8D] to-[#18C97A] flex items-center justify-center shadow-xl">
                <Megaphone className="h-8 w-8 text-white" />
              </div>
            )}
            <span className="font-heading font-bold text-2xl text-white">{logos.site_name || 'EarnClicks'}</span>
          </div>

          {/* Smartphone Mockup - Advertiser Dashboard */}
          <div className="flex-1 flex items-center justify-center mb-12 relative">
            <div className="relative w-80 h-[600px] mx-auto">
              <div className="absolute inset-0 rounded-[40px] bg-gray-900 border-4 border-gray-700 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-900 rounded-b-2xl z-10" />
                <div className="w-full h-full p-6 pt-14" style={{ background: 'linear-gradient(180deg, #0F172A, #1a2744)' }}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E8A8D] to-[#18C97A] flex items-center justify-center">
                        <Megaphone className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white/50 text-xs">Advertiser Dashboard</p>
                        <p className="text-white font-bold text-xl">Campaign Manager</p>
                      </div>
                      <span className="text-[#18C97A] text-xs font-medium bg-[#18C97A]/10 px-2 py-1 rounded-lg">Pro</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { l: 'Active', v: '3', c: '#1E8A8D' },
                        { l: 'Completed', v: '12', c: '#2D4F97' },
                        { l: 'Pending', v: '2', c: '#F59E0B' },
                        { l: 'Total Spend', v: '$2.4K', c: '#18C97A' },
                      ].map((item) => (
                        <div key={item.l} className="bg-white/5 rounded-xl p-3 text-center">
                          <p className="text-[10px] text-white/50">{item.l}</p>
                          <p className="text-white font-bold text-sm mt-0.5" style={{ color: item.c }}>{item.v}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      {[
                        { n: 'Instagram Followers', r: '45%', s: '1,234', p: 'instagram' },
                        { n: 'YouTube Views', r: '67%', s: '892', p: 'youtube' },
                        { n: 'TikTok Followers', r: '34%', s: '2,100', p: 'tiktok' },
                        { n: 'Telegram Members', r: '89%', s: '567', p: 'telegram' },
                        { n: 'Twitter Followers', r: '23%', s: '340', p: 'twitter' },
                      ].map((campaign) => (
                        <div key={campaign.n} className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/60 shrink-0">
                              {platformIcons.find(p => p.name.toLowerCase() === campaign.p)?.icon || <Target className="h-5 w-5" />}
                            </div>
                            <div>
                              <p className="text-white text-xs font-medium">{campaign.n}</p>
                              <p className="text-white/50 text-[10px]">{campaign.s} delivered</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[#18C97A] text-xs font-bold">{campaign.r} complete</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E8A8D] to-[#18C97A] flex items-center justify-center shadow-lg animate-float">
                <Megaphone className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-2xl bg-[#1E8A8D] flex items-center justify-center shadow-lg animate-float-delayed">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { v: '1,023', l: 'Active Campaigns', icon: <Target className="h-6 w-6" /> },
              { v: '45.8K', l: 'Total Clicks', icon: <MousePointer2 className="h-6 w-6" /> },
              { v: '340%', l: 'Avg. ROI', icon: <TrendingUp className="h-6 w-6" /> },
              { v: '12+', l: 'Platforms', icon: <Globe className="h-6 w-6" /> },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 group hover:bg-white/15 transition-all">
                <div className="flex items-center justify-center gap-2 text-white/80 mb-2 group-hover:scale-110 transition-transform">
                  <span style={{ color: stat.icon.props.color || '#18C97A' }}>{stat.icon}</span>
                </div>
                <p className="font-heading text-2xl font-bold text-white">{stat.v}</p>
                <p className="text-white/60 text-xs uppercase tracking-wider">{stat.l}</p>
              </div>
            ))}
          </div>

          {/* Campaign Types */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <Users className="h-5 w-5" />, title: 'Follower Growth', desc: 'Real followers from target countries', color: '#1E8A8D' },
              { icon: <Play className="h-5 w-5" />, title: 'Video Views', desc: 'Authentic views with retention', color: '#18C97A' },
              { icon: <UserPlus className="h-5 w-5" />, title: 'Subscribers', desc: 'Grow channel subscribers', color: '#2D4F97' },
              { icon: <Globe className="h-5 w-5" />, title: 'Website Traffic', desc: 'Targeted visitors to your site', color: '#F59E0B' },
              { icon: <Smartphone className="h-5 w-5" />, title: 'App Installs', desc: 'Drive mobile app downloads', color: '#8B5CF6' },
              { icon: <Star className="h-5 w-5" />, title: 'Custom Actions', desc: 'Any social media action', color: '#EC4899' },
            ].map((ct, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 group hover:bg-white/15 transition-all text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform" style={{ background: `linear-gradient(135deg, ${ct.color}, ${ct.color}dd)` }}>
                  {ct.icon}
                </div>
                <p className="font-semibold text-white text-sm">{ct.title}</p>
                <p className="text-white/50 text-xs mt-1">{ct.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              {logos.header_logo ? (
                <LogoImage src={logos.header_logo} type={logos.header_logo_type || 'png'} alt="EarnClicks" className="h-10 w-auto" defaultLogo={null} />
              ) : (
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#1E8A8D] to-[#18C97A] flex items-center justify-center shadow-lg">
                  <Megaphone className="h-6 w-6 text-white" />
                </div>
              )}
              <span className="font-heading font-bold text-xl bg-gradient-to-r from-[#1E8A8D] to-[#18C97A] bg-clip-text text-transparent">{logos.site_name || 'EarnClicks'}</span>
            </Link>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-semibold mb-6 mx-auto max-w-fit">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            ADVERTISER REGISTRATION
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-teal-900/10 border border-gray-100 p-8 lg:p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E8A8D] to-[#18C97A] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-900/30">
                <Megaphone className="h-8 w-8 text-white" />
              </div>
              <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">Become an Advertiser</h1>
              <p className="text-gray-500 text-sm">Launch campaigns that generate genuine engagement across all major social media platforms.</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-50 border-red-100 text-red-600">
                <AlertDescription className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center mb-4">
                <label className="relative cursor-pointer group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1E8A8D] to-[#18C97A] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg shadow-teal-900/30 group-hover:border-teal-400/50 transition-all">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Megaphone className="h-10 w-10 text-white" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#1E8A8D] to-[#18C97A] flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-4 w-4" />
                  </div>
                </label>
                <p className="text-xs text-teal-400 mt-2 text-center">Click to upload profile photo (max 5MB)</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="pl-12"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="username"
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                      className="pl-12"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="pl-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country</Label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full h-12 pl-12 pr-10 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none cursor-pointer"
                    >
                      {countries.map((c) => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-medium text-gray-700">State / Province</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full h-12 pl-12 pr-10 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select State</option>
                      {selectedCountry.states.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="city"
                      placeholder="New York"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="pl-12"
                    />
                  </div>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Mobile Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <div className="flex items-center h-12 pl-9 rounded-xl border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500 transition-all">
                      <span className="text-xs font-semibold text-gray-700 pr-2 border-r border-gray-200 min-w-[2.8rem] text-center select-none">
                        {getCountryByCode(formData.country)?.phoneCode || '+1'}
                      </span>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="(555) 000-0000"
                        value={formData.phone.replace(/^\+\d+\s*/, '')}
                        onChange={(e) => {
                          const code = getCountryByCode(formData.country)?.phoneCode || '+1';
                          setFormData({ ...formData, phone: `${code} ${e.target.value}` });
                        }}
                        className="flex-1 px-2 bg-transparent outline-none text-gray-900 text-sm h-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-sm font-medium text-gray-700">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      required
                      max={new Date().toISOString().split('T')[0]}
                      className="pl-12"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full h-12 pl-12 pr-10 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none cursor-pointer"
                    >
                      {genders.map((g) => (
                        <option key={g.value} value={g.value}>{g.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-sm font-medium text-gray-700">Language</Label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      id="language"
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full h-12 pl-12 pr-10 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none cursor-pointer"
                    >
                      {languages.map((l) => (
                        <option key={l.code} value={l.code}>{l.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-sm font-medium text-gray-700">Timezone</Label>
                  <div className="relative">
                    <Clock3 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      id="timezone"
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      className="w-full h-12 pl-12 pr-10 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none cursor-pointer"
                    >
                      {timezones.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referral" className="text-sm font-medium text-gray-700">Referral Code (Optional)</Label>
                <div className="relative">
                  <Gift className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="referral"
                    placeholder="Enter referral code for bonus"
                    value={formData.referral_code}
                    onChange={(e) => setFormData({ ...formData, referral_code: e.target.value })}
                    className="pl-12"
                  />
                </div>
                <p className="text-xs text-gray-500">Earn 5 USDT bonus with a valid referral code</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={8}
                      className="pl-12 pr-12"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">At least 8 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      className="pl-12"
                    />
                  </div>
                </div>
              </div>

              {/* Wallet Settings */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-teal-600" />
                  Wallet Settings
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="walletCurrency" className="text-sm font-medium text-gray-700">Wallet Currency</Label>
                    <div className="relative">
                      <CircleDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        id="walletCurrency"
                        value={formData.walletCurrency}
                        onChange={(e) => setFormData({ ...formData, walletCurrency: e.target.value })}
                        className="w-full h-12 pl-12 pr-10 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none cursor-pointer"
                      >
                        <option value="USDT">USDT (Tether)</option>
                        <option value="BTC">BTC (Bitcoin)</option>
                        <option value="ETH">ETH (Ethereum)</option>
                        <option value="BNB">BNB (Binance Coin)</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="network" className="text-sm font-medium text-gray-700">Preferred Network</Label>
                    <div className="relative">
                      <CircleDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        id="network"
                        value={formData.network}
                        onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                        className="w-full h-12 pl-12 pr-10 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none cursor-pointer"
                      >
                        {networks.map((n) => (
                          <option key={n.value} value={n.value}>{n.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                    required
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500/20"
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                    I agree to the{' '}
                    <Link href="/terms" className="text-teal-600 hover:text-teal-700 underline">Terms of Service</Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-teal-600 hover:text-teal-700 underline">Privacy Policy</Link>
                  </Label>
                </div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="recaptcha"
                    checked={formData.recaptcha}
                    onChange={(e) => setFormData({ ...formData, recaptcha: e.target.checked })}
                    required
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500/20"
                  />
                  <Label htmlFor="recaptcha" className="text-sm text-gray-600 cursor-pointer flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-400" />
                    I am not a robot
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-14 rounded-xl font-semibold text-white text-base overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-teal-900/20 disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg, #0F172A, #1E8A8D, #18C97A)' }}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    CREATE ADVERTISER ACCOUNT
                    <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </Button>
            </form>

            {/* Social Login */}
            <div className="mt-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-400">Or continue with</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button type="button" className="flex items-center justify-center gap-2 h-12 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-all">
                  <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.09 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 h-12 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-all">
                  <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </button>
                <button type="button" className="flex items-center justify-center gap-2 h-12 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-all">
                  <svg className="h-5 w-5" fill="black" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                  Apple
                </button>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center mb-6 uppercase tracking-wider">Why advertise with EarnClicks?</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <CheckCircle2 className="h-4 w-4" />, text: 'Real Human Engagement' },
                  { icon: <CheckCircle2 className="h-4 w-4" />, text: 'AI-Powered Targeting' },
                  { icon: <CheckCircle2 className="h-4 w-4" />, text: 'Fraud Protection' },
                  { icon: <CheckCircle2 className="h-4 w-4" />, text: 'Detailed Analytics' },
                  { icon: <CheckCircle2 className="h-4 w-4" />, text: 'Flexible Budgeting' },
                  { icon: <CheckCircle2 className="h-4 w-4" />, text: 'Dedicated Support' },
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 transition-all">
                    <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">{benefit.icon}</div>
                    <span className="text-sm text-gray-700">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-center text-sm text-gray-500 mb-4">
                Already have an account?{' '}
                <Link href="/advertiser-login" className="font-semibold text-teal-600 hover:text-teal-700 transition-colors">Login Now</Link>
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
                <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
                <Link href="/support" className="hover:text-gray-600 transition-colors">Support</Link>
              </div>
              <p className="text-center text-xs text-gray-400 mt-6">© 2026 EarnClicks. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}