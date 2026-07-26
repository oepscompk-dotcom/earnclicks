'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Award, Star, Trophy, Medal, Gift, TrendingUp,
  Users, Check, Zap, Shield, Gem, Clock, Copy,
  ChevronRight, Sparkles,
} from 'lucide-react';

type Tier = 'bronze' | 'silver' | 'gold' | 'platinum';

interface TierConfig {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  gradient: string;
  minPoints: number;
  benefits: string[];
}

interface PointsRecord {
  id: number;
  date: string;
  description: string;
  points: number;
  type: 'earned' | 'spent';
}

interface Reward {
  id: number;
  name: string;
  description: string;
  points: number;
  icon: React.ReactNode;
}

const TIER_CONFIG: Record<Tier, TierConfig> = {
  bronze: {
    label: 'Bronze',
    icon: <Medal className="h-6 w-6" />,
    color: '#B45309',
    bg: '#FEF3C7',
    gradient: 'from-amber-600 to-amber-400',
    minPoints: 0,
    benefits: ['5% bonus on deposits', 'Basic analytics', 'Email support', 'Standard withdrawal limits'],
  },
  silver: {
    label: 'Silver',
    icon: <Award className="h-6 w-6" />,
    color: '#6B7280',
    bg: '#F3F4F6',
    gradient: 'from-gray-400 to-gray-300',
    minPoints: 1000,
    benefits: ['10% bonus on deposits', 'Advanced analytics', 'Priority email support', 'Higher withdrawal limits', 'Monthly rewards'],
  },
  gold: {
    label: 'Gold',
    icon: <Trophy className="h-6 w-6" />,
    color: '#D97706',
    bg: '#FEF3C7',
    gradient: 'from-yellow-500 to-amber-400',
    minPoints: 5000,
    benefits: ['20% bonus on deposits', 'Premium analytics', 'Priority chat & email support', 'VIP withdrawal limits', 'Weekly rewards', 'Dedicated account manager'],
  },
  platinum: {
    label: 'Platinum',
    icon: <Gem className="h-6 w-6" />,
    color: '#7C3AED',
    bg: '#EDE9FE',
    gradient: 'from-purple-600 to-purple-400',
    minPoints: 15000,
    benefits: ['35% bonus on deposits', 'Real-time analytics', '24/7 VIP support', 'Unlimited withdrawal limits', 'Daily rewards', 'Dedicated account manager', 'Early access to new features'],
  },
};

const MOCK_POINTS_HISTORY: PointsRecord[] = [
  { id: 1, date: '2026-07-26', description: 'Deposit bonus (500 USDT)', points: 500, type: 'earned' },
  { id: 2, date: '2026-07-25', description: 'Campaign completed bonus', points: 200, type: 'earned' },
  { id: 3, date: '2026-07-24', description: 'Redeemed: Boost Discount', points: -300, type: 'spent' },
  { id: 4, date: '2026-07-23', description: 'Referral bonus - John D.', points: 250, type: 'earned' },
  { id: 5, date: '2026-07-22', description: 'Daily login reward', points: 10, type: 'earned' },
  { id: 6, date: '2026-07-21', description: 'Deposit bonus (1000 USDT)', points: 1000, type: 'earned' },
];

const MOCK_REWARDS: Reward[] = [
  { id: 1, name: 'Campaign Boost Discount', description: 'Get 20% off any Boost package', points: 500, icon: <Zap className="h-5 w-5" /> },
  { id: 2, name: 'Deposit Bonus Voucher', description: 'Extra 15% on your next deposit up to 1000 USDT', points: 800, icon: <Gift className="h-5 w-5" /> },
  { id: 3, name: 'Priority Support 1 Month', description: 'Skip the line with priority support for 30 days', points: 1200, icon: <Shield className="h-5 w-5" /> },
  { id: 4, name: 'Featured Campaign Slot', description: 'Get 7 days of featured campaign placement', points: 2000, icon: <Star className="h-5 w-5" /> },
];

function getNextTier(currentTier: Tier): { tier: Tier; config: TierConfig } | null {
  const order: Tier[] = ['bronze', 'silver', 'gold', 'platinum'];
  const idx = order.indexOf(currentTier);
  if (idx >= order.length - 1) return null;
  const next = order[idx + 1];
  return { tier: next, config: TIER_CONFIG[next] };
}

export default function LoyaltyPage() {
  const [currentTier] = useState<Tier>('gold');
  const [points] = useState(7200);

  const tierConfig = TIER_CONFIG[currentTier];
  const nextTier = getNextTier(currentTier);
  const nextTierPoints = nextTier ? TIER_CONFIG[nextTier.tier].minPoints : null;
  const currentTierPoints = TIER_CONFIG[currentTier].minPoints;
  const progress = nextTierPoints
    ? Math.min(((points - currentTierPoints) / (nextTierPoints - currentTierPoints)) * 100, 100)
    : 100;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Loyalty Rewards</h1>
        <p className="text-sm text-gray-400 mt-1">Earn points and unlock exclusive benefits</p>
      </div>

      <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className={cn('p-6 bg-gradient-to-r text-white', tierConfig.gradient)}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {tierConfig.icon}
                <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs px-3 py-0.5 rounded-full">
                  {tierConfig.label}
                </Badge>
              </div>
              <p className="text-3xl font-bold">{points.toLocaleString()}</p>
              <p className="text-sm text-white/80 mt-1">Loyalty Points</p>
            </div>
            {nextTier && (
              <div className="text-right">
                <p className="text-sm text-white/80">Next Tier</p>
                <div className="flex items-center gap-1.5 mt-1">
                  {nextTier.config.icon}
                  <span className="text-lg font-bold">{nextTier.config.label}</span>
                </div>
                <p className="text-xs text-white/60 mt-0.5">{nextTierPoints!.toLocaleString()} points needed</p>
              </div>
            )}
          </div>
        </div>
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                {tierConfig.label} ({currentTierPoints.toLocaleString()} pts)
              </span>
              {nextTier && (
                <span className="text-gray-500">
                  {nextTier.config.label} ({nextTierPoints!.toLocaleString()} pts)
                </span>
              )}
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-500 bg-gradient-to-r', tierConfig.gradient)}
                style={{ width: `${progress}%` }}
              />
            </div>
            {nextTier && (
              <p className="text-xs text-gray-400 text-center">
                {nextTierPoints! - points} more points to reach {nextTier.config.label}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-[#2D4F97]" />
              Current Tier Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tierConfig.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: tierConfig.bg }}>
                    <Check className="h-4 w-4" style={{ color: tierConfig.color }} />
                  </div>
                  <span className="text-sm text-gray-600">{b}</span>
                </div>
              ))}
            </div>
            {nextTier && (
              <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-2">UNLOCK AT {nextTier.config.label.toUpperCase()}</p>
                <div className="space-y-1.5">
                  {nextTier.config.benefits.filter((b) => !tierConfig.benefits.includes(b)).map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                      <Sparkles className="h-3.5 w-3.5 text-gray-300" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Gift className="h-5 w-5 text-[#1E8A8D]" />
              Available Rewards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_REWARDS.map((reward) => (
              <div key={reward.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2D4F97]/10 to-[#18C79A]/10 flex items-center justify-center text-[#2D4F97]">
                    {reward.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{reward.name}</p>
                    <p className="text-xs text-gray-400">{reward.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] px-2 py-0 bg-[#2D4F97]/10 text-[#2D4F97] border-[#2D4F97]/20 whitespace-nowrap">
                    {reward.points.toLocaleString()} pts
                  </Badge>
                  <Button
                    size="sm"
                    disabled={points < reward.points}
                    className={cn(
                      'rounded-xl text-xs',
                      points >= reward.points
                        ? 'bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] text-white'
                        : 'bg-gray-100 text-gray-400'
                    )}
                  >
                    Redeem
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#2D4F97]" />
            Points History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-4">Date</th>
                  <th className="px-4 py-4">Description</th>
                  <th className="px-4 py-4 text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_POINTS_HISTORY.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-500">{r.date}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{r.description}</td>
                    <td className="px-4 py-4 text-right">
                      <span className={cn('text-sm font-semibold', r.type === 'earned' ? 'text-emerald-600' : 'text-red-500')}>
                        {r.type === 'earned' ? '+' : ''}{r.points.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-[#18C79A]" />
            Referral Bonus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Invite other advertisers and earn points when they make their first deposit.</p>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <code className="text-sm font-mono text-[#2D4F97] flex-1">EARNC-{Math.random().toString(36).slice(2, 8).toUpperCase()}</code>
                <button className="p-1.5 rounded-lg hover:bg-white text-gray-400 hover:text-gray-600 transition-colors">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#18C79A]/10 border border-[#18C79A]/20">
                <div>
                  <p className="text-sm font-medium text-gray-900">Your Referral Link</p>
                  <p className="text-xs text-gray-400">Share and earn 10% of their first deposit</p>
                </div>
                <Badge variant="outline" className="bg-[#18C79A]/10 text-emerald-700 border-[#18C79A]/20 text-xs">
                  250 pts per referral
                </Badge>
              </div>
              <p className="text-xs text-gray-400">You've earned <strong className="text-gray-600">1,250</strong> points from referrals so far.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
