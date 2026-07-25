'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2, CheckCircle2, Shield, Zap, Coins, Users, TrendingUp, Globe, Award, Star, Gift, Lock, Mail, User, Send, BarChart3, Target, Smartphone, Heart, MessageCircle, Share2, UserPlus, ThumbsUp, Twitter, Instagram, Youtube, Facebook, Music, Gamepad2, Linkedin, Download, ArrowRight, Sparkles, Zap as ZapIcon, Play } from 'lucide-react';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { LogoImage } from '@/components/ui/logo-image';

const taskFeatures = [
  { icon: <Play className="h-5 w-5" />, title: 'Watch Videos', desc: 'Earn 0.02 USDT per view' },
  { icon: <ThumbsUp className="h-5 w-5" />, title: 'Like Posts', desc: 'Earn 0.01 USDT per like' },
  { icon: <UserPlus className="h-5 w-5" />, title: 'Follow Accounts', desc: 'Earn 0.03 USDT per follow' },
  { icon: <MessageCircle className="h-5 w-5" />, title: 'Write Comments', desc: 'Earn 0.04 USDT per comment' },
  { icon: <Share2 className="h-5 w-5" />, title: 'Share Content', desc: 'Earn 0.035 USDT per share' },
  { icon: <Send className="h-5 w-5" />, title: 'Join Telegram', desc: 'Earn 0.02 USDT per join' },
];

const advertiserFeatures = [
  { icon: <Target className="h-5 w-5" />, title: 'Follower Growth', desc: 'Real followers from target countries' },
  { icon: <Play className="h-5 w-5" />, title: 'Video Views', desc: 'Authentic views with retention' },
  { icon: <UserPlus className="h-5 w-5" />, title: 'Subscribers', desc: 'Grow channel subscribers' },
  { icon: <Globe className="h-5 w-5" />, title: 'Website Traffic', desc: 'Targeted visitors to your site' },
  { icon: <Smartphone className="h-5 w-5" />, title: 'App Installs', desc: 'Drive mobile app downloads' },
  { icon: <Star className="h-5 w-5" />, title: 'Custom Actions', desc: 'Any social media action' },
];

const trustSignals = [
  { icon: <Shield className="h-5 w-5" />, text: 'AI Verified' },
  { icon: <ZapIcon className="h-5 w-5" />, text: 'Instant Payouts' },
  { icon: <Globe className="h-5 w-5" />, text: '150+ Countries' },
  { icon: <Users className="h-5 w-5" />, text: '250K+ Users' },
];

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    referral_code: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logos } = useSiteSettings();
  const role = searchParams.get('role') || 'user';
  const isAdvertiser = role === 'advertiser';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ ...formData, role });
      router.push(isAdvertiser ? '/advertiser' : '/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const features = isAdvertiser ? advertiserFeatures : taskFeatures;
  const gradientFrom = isAdvertiser ? '#0F172A' : '#2D4F97';
  const gradientTo = isAdvertiser ? '#18C97A' : '#18C97A';
  const accentColor = isAdvertiser ? '#1E8A8D' : '#1E8A8D';
  const title = isAdvertiser ? 'Become an Advertiser' : 'Become a Tasker';
  const subtitle = isAdvertiser 
    ? 'Launch campaigns that generate genuine engagement across all major social media platforms.'
    : 'Complete simple social media tasks and receive instant USDT rewards.';

  return (
    <div className="min-h-screen flex" style={{ background: `linear-gradient(135deg, ${gradientFrom} 0%, ${accentColor} 50%, ${gradientTo} 100%)` }}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-dark opacity-20" />
      <div className="absolute top-20 left-[10%] w-80 h-80 rounded-full bg-white/5 blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-20 right-[10%] w-72 h-72 rounded-full bg-white/5 blur-[100px] animate-pulse-slow" />

      <div className="relative z-10 flex-1 flex items-center justify-center p-4 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              {logos.header_logo ? (
                <LogoImage src={logos.header_logo} type={logos.header_logo_type || 'png'} alt="EarnClicks" className="h-10 w-auto" defaultLogo={null} />
              ) : (
                <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">EC</span>
                </div>
              )}
              <span className="font-heading font-bold text-xl gradient-primary-text">{logos.site_name || 'EarnClicks'}</span>
            </Link>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-semibold mb-6 mx-auto max-w-fit">
            <span className="w-2 h-2 rounded-full bg-white/50 animate-pulse" />
            {isAdvertiser ? 'Advertiser Registration' : 'Tasker Registration'}
          </div>

          {/* Main Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl shadow-black/20">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-900/30">
                {isAdvertiser ? (
                  <Send className="h-8 w-8 text-white" />
                ) : (
                  <Coins className="h-8 w-8 text-white" />
                )}
              </div>
              <h1 className="font-heading text-3xl font-bold text-white mb-2">{title}</h1>
              <p className="text-white/70 text-sm">{subtitle}</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-500/20 border-red-500/30 text-red-100">
                <AlertDescription className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0" />
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white/80 text-sm font-medium">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="pl-12 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80 text-sm font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="pl-12 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80 text-sm font-medium">Password</Label>
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
                    className="pl-12 pr-12 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-white/50 text-xs ml-1">At least 8 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white/80 text-sm font-medium">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.password_confirmation}
                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                    required
                    className="pl-12 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referral" className="text-white/80 text-sm font-medium">Referral Code (Optional)</Label>
                <div className="relative">
                  <Gift className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="referral"
                    placeholder="Enter referral code for bonus"
                    value={formData.referral_code}
                    onChange={(e) => setFormData({ ...formData, referral_code: e.target.value })}
                    className="pl-12 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                </div>
                <p className="text-white/50 text-xs ml-1">Earn extra bonus with a valid referral code</p>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 w-4 h-4 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-500/20"
                />
                <Label htmlFor="terms" className="text-white/70 text-sm cursor-pointer">
                  I agree to the{' '}
                  <Link href="/terms" className="text-white hover:text-blue-300 underline">Terms of Service</Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-white hover:text-blue-300 underline">Privacy Policy</Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-14 rounded-xl font-semibold text-white text-base overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20 disabled:opacity-70"
                style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${accentColor}, ${gradientTo})` }}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create Account
                    <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white/60 text-sm">
                <Link
                  href={isAdvertiser ? '/advertiser-login' : '/tasker-login'}
                  className="text-white hover:text-blue-300 font-medium transition-colors flex items-center gap-1"
                >
                  Already have an account? Sign In
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-white/50 text-xs text-center mb-4 uppercase tracking-wider">Trusted by thousands worldwide</p>
              <div className="flex flex-wrap justify-center gap-3">
                {trustSignals.map((signal, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs">
                    {signal.icon} {signal.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-8 text-center">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-4">What you get</p>
            <div className="grid grid-cols-2 gap-3">
              {features.slice(0, 4).map((feature, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-left group hover:bg-white/10 transition-all">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white/80 mb-3 group-hover:scale-110 transition-transform" style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${accentColor})` }}>
                    {feature.icon}
                  </div>
                  <div className="font-medium text-white text-sm">{feature.title}</div>
                  <div className="text-white/50 text-xs mt-0.5">{feature.desc}</div>
                </div>
              ))}
            </div>
            <p className="text-white/50 text-xs mt-4">+ {features.length - 4} more features available after registration</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}