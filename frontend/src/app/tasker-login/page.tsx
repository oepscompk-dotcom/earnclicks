'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { LogoImage } from '@/components/ui/logo-image';
import { Eye, EyeOff, Mail, Lock, Loader2, Shield, Smartphone, Users, Target, DollarSign, ArrowUpRight, Zap, Facebook, Instagram, Youtube, Music, Twitter, MessageCircle as Telegram, Gamepad2, Linkedin } from 'lucide-react';

const socialIcons = [
  { icon: <Facebook className="h-5 w-5" />, color: '#1877F2' },
  { icon: <Instagram className="h-5 w-5" />, color: '#E4405F' },
  { icon: <Music className="h-5 w-5" />, color: '#000000' },
  { icon: <Youtube className="h-5 w-5" />, color: '#FF0000' },
  { icon: <Telegram className="h-5 w-5" />, color: '#26A5E4' },
  { icon: <Linkedin className="h-5 w-5" />, color: '#0A66C2' },
  { icon: <Twitter className="h-5 w-5" />, color: '#1DA1F2' },
  { icon: <Gamepad2 className="h-5 w-5" />, color: '#5865F2' },
];

const features = [
  { icon: <DollarSign className="h-5 w-5" />, text: 'Instant Rewards' },
  { icon: <Target className="h-5 w-5" />, text: 'Daily Tasks' },
  { icon: <Users className="h-5 w-5" />, text: 'Referral Income' },
  { icon: <Shield className="h-5 w-5" />, text: 'VIP Membership' },
  { icon: <Smartphone className="h-5 w-5" />, text: 'Secure Platform' },
  { icon: <Zap className="h-5 w-5" />, text: 'Fast Withdrawals' },
];

export default function TaskerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { logos } = useSiteSettings();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await login(email, password);
      if (response.user.role === 'admin') router.push('/admin');
      else if (response.user.role === 'advertiser') router.push('/advertiser');
      else router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const logo = (
    <div className="flex items-center gap-2">
      {logos.header_logo ? (
        <LogoImage src={logos.header_logo} type={logos.header_logo_type || 'png'} alt="EarnClicks" className="h-8 w-auto" defaultLogo={null} />
      ) : (
        <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center">
          <span className="text-white font-bold text-sm">EC</span>
        </div>
      )}
      <span className="font-heading font-bold text-xl tracking-tight gradient-primary-text">{logos.site_name || 'EarnClicks'}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden flex-col justify-between p-12" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1a2744 40%, #1E8A8D 70%, #18C97A 100%)' }}>
        <div className="absolute inset-0 bg-grid-dark opacity-20" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-green-500/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-teal-500/5 blur-[150px]" />

        {/* Floating Coins */}
        <div className="absolute top-20 left-[15%] w-10 h-10 animate-float opacity-30">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-lg shadow-yellow-500/30 flex items-center justify-center"><span className="text-xs font-bold text-yellow-900">$</span></div>
        </div>
        <div className="absolute top-40 right-[20%] w-8 h-8 animate-float-delayed opacity-25">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-lg shadow-yellow-500/30 flex items-center justify-center"><span className="text-xs font-bold text-yellow-900">$</span></div>
        </div>
        <div className="absolute bottom-40 left-[25%] w-6 h-6 animate-float-slow opacity-20">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-lg shadow-yellow-500/30 flex items-center justify-center"><span className="text-xs font-bold text-yellow-900">$</span></div>
        </div>

        {/* Social Icons */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {socialIcons.map((s, i) => (
            <div key={i} className="absolute" style={{
              top: `${15 + (i * 10)}%`,
              left: `${i < 4 ? 8 + (i * 5) : 75 + ((i - 4) * 5)}%`,
              animation: `float ${5 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`,
            }}>
              <div className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center border border-white/10" style={{ color: s.color }}>
                {s.icon}
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10">
          {logo}
        </div>

        <div className="relative z-10 max-w-xl">
          <h1 className="font-heading text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
            Complete Tasks.<br />
            <span className="gradient-primary-text">Earn USDT.</span><br />
            Grow Every Day.
          </h1>
          <p className="text-lg text-gray-300 mb-8">Join thousands of users earning rewards by completing simple social media tasks.</p>

          <div className="grid grid-cols-2 gap-3 mb-10">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 glass rounded-xl px-4 py-3 border border-white/5">
                <div className="text-green-400 shrink-0">{f.icon}</div>
                <span className="text-sm text-gray-200">{f.text}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-6">
            {[
              { label: 'Taskers', value: '250K+' },
              { label: 'Tasks Done', value: '1M+' },
              { label: 'USDT Paid', value: '500K+' },
              { label: 'Countries', value: '150+' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-heading text-2xl font-bold gradient-primary-text">{s.value}</div>
                <div className="text-xs text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Card */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            {logo}
          </div>

          <div className="bg-white rounded-[20px] shadow-2xl shadow-blue-900/10 border border-gray-100 p-8 lg:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <Shield className="h-3 w-3" />
                TASKER LOGIN
              </div>
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
              <p className="text-gray-500">Login to continue earning USDT.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                  <div className="w-1 h-8 bg-red-400 rounded-full shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-14 pl-12 pr-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-14 pl-12 pr-12 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative w-full h-14 rounded-xl font-semibold text-white text-base overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20 disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg, #2D4F97, #18C97A)' }}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    LOGIN TO DASHBOARD
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-gray-400 font-medium">OR CONTINUE WITH</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <button className="h-12 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm font-medium text-gray-700">
                <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
              <button className="h-12 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm font-medium text-gray-700">
                <Facebook className="h-5 w-5 text-[#1877F2]" />
                Facebook
              </button>
              <button className="h-12 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm font-medium text-gray-700">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#000"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                Apple
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-semibold gradient-primary-text hover:opacity-80 transition-opacity">
                  Create Free Tasker Account
                </Link>
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-gray-100">
              {[
                { icon: <Shield className="h-3.5 w-3.5" />, text: 'SSL Secure' },
                { icon: <Lock className="h-3.5 w-3.5" />, text: 'Encrypted' },
                { icon: <Smartphone className="h-3.5 w-3.5" />, text: '2FA' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-400">
                  {s.icon}
                  {s.text}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-6">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <Link href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
              <span className="text-gray-300">|</span>
              <Link href="#" className="hover:text-gray-600 transition-colors">Terms &amp; Conditions</Link>
              <span className="text-gray-300">|</span>
              <Link href="#" className="hover:text-gray-600 transition-colors">Support</Link>
            </div>
            <p className="text-xs text-gray-400 mt-3">&copy; 2026 EarnClicks. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
