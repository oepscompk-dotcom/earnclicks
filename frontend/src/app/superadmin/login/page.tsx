'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { LogoImage } from '@/components/ui/logo-image';
import { Eye, EyeOff, Mail, Lock, Loader2, Shield, Smartphone, Users, DollarSign, ArrowUpRight, BarChart3, Settings, Activity, Server } from 'lucide-react';

export default function AdminLoginPage() {
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
    <div className="min-h-screen bg-[#0F172A] flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden flex-col justify-between p-12" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1a2744 50%, #2D4F97 100%)' }}>
        <div className="absolute inset-0 bg-grid-dark opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-indigo-500/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[150px]" />

        <div className="relative z-10">{logo}</div>

        <div className="relative z-10 max-w-xl">
          <h1 className="font-heading text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
            Admin Dashboard.<br />
            <span className="text-blue-400">Full Control.</span><br />
            Manage Everything.
          </h1>
          <p className="text-lg text-gray-400 mb-8">Monitor users, campaigns, payments, and platform analytics from one place.</p>

          <div className="grid grid-cols-2 gap-3 mb-10">
            {[
              { icon: <Users className="h-5 w-5" />, text: 'User Management' },
              { icon: <BarChart3 className="h-5 w-5" />, text: 'Analytics' },
              { icon: <Settings className="h-5 w-5" />, text: 'Platform Settings' },
              { icon: <Shield className="h-5 w-5" />, text: 'KYC Verification' },
              { icon: <Activity className="h-5 w-5" />, text: 'Activity Logs' },
              { icon: <Server className="h-5 w-5" />, text: 'System Health' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 glass rounded-xl px-4 py-3 border border-white/5">
                <div className="text-blue-400 shrink-0">{f.icon}</div>
                <span className="text-sm text-gray-300">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">{logo}</div>

          <div className="bg-white rounded-[20px] shadow-2xl shadow-blue-900/20 p-8 lg:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <Shield className="h-3 w-3" />
                ADMIN LOGIN
              </div>
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Admin Access</h2>
              <p className="text-gray-500">Authorized personnel only.</p>
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
                  <input type="email" placeholder="admin@earnclicks.app" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full h-14 pl-12 pr-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full h-14 pl-12 pr-12 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" />
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

              <button type="submit" disabled={loading} className="relative w-full h-14 rounded-xl font-semibold text-white text-base overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20 disabled:opacity-70" style={{ background: 'linear-gradient(135deg, #2D4F97, #1E8A8D)' }}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : (
                  <span className="flex items-center justify-center gap-2">
                    ACCESS DASHBOARD
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                )}
              </button>
            </form>

            <div className="text-center mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Returning to{' '}
                <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  User Login
                </Link>
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 mt-6">
              {[
                { icon: <Shield className="h-3.5 w-3.5" />, text: 'SSL Secure' },
                { icon: <Lock className="h-3.5 w-3.5" />, text: 'Encrypted' },
                { icon: <Smartphone className="h-3.5 w-3.5" />, text: '2FA' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-400">{s.icon}{s.text}</div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-gray-600 mt-6">&copy; 2026 EarnClicks. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
