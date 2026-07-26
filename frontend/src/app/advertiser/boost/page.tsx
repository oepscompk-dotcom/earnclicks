'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Rocket, Zap, Crown, Check, Users,
  Timer, Calendar, Star, Shield,
  ChevronRight,
} from 'lucide-react';

interface BoostPackage {
  id: number;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular: boolean;
  color: string;
  gradient: string;
}

interface CurrentBoost {
  id: number;
  campaign: string;
  package: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'scheduled';
}

const BOOST_PACKAGES: BoostPackage[] = [
  {
    id: 1, name: 'Basic Boost', price: '99', period: 'per week',
    features: ['Priority placement in 1 category', '5% faster task completion', 'Basic analytics', 'Email support'],
    popular: false, color: '#1E8A8D', gradient: 'from-[#1E8A8D] to-[#26B5B8]',
  },
  {
    id: 2, name: 'Premium Boost', price: '249', period: 'per week',
    features: ['Featured placement in 3 categories', '15% faster task completion', 'Advanced analytics dashboard', 'Priority email & chat support', 'Dedicated account manager'],
    popular: true, color: '#2D4F97', gradient: 'from-[#2D4F97] to-[#3B6BC8]',
  },
  {
    id: 3, name: 'Enterprise Boost', price: '599', period: 'per week',
    features: ['Top placement in all categories', '30% faster task completion', 'Real-time analytics & insights', '24/7 priority support', 'Dedicated account manager', 'Custom campaign optimization', 'API access for automation'],
    popular: false, color: '#18C79A', gradient: 'from-[#18C79A] to-[#20E8B0]',
  },
];

const MOCK_CURRENT_BOOSTS: CurrentBoost[] = [
  { id: 1, campaign: 'Summer Sale Video Promo', package: 'Premium Boost', startDate: '2026-07-20', endDate: '2026-07-27', status: 'active' },
  { id: 2, campaign: 'TikTok Viral Challenge', package: 'Basic Boost', startDate: '2026-07-15', endDate: '2026-07-22', status: 'active' },
  { id: 3, campaign: 'Website Traffic Campaign', package: 'Enterprise Boost', startDate: '2026-07-28', endDate: '2026-08-04', status: 'scheduled' },
];

export default function BoostPage() {
  const [currentBoosts] = useState<CurrentBoost[]>(MOCK_CURRENT_BOOSTS);

  const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    active: { label: 'Active', color: '#059669', bg: '#D1FAE5' },
    completed: { label: 'Completed', color: '#4B5563', bg: '#F3F4F6' },
    scheduled: { label: 'Scheduled', color: '#B45309', bg: '#FEF3C7' },
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Campaign Boost</h1>
        <p className="text-sm text-gray-400 mt-1">Accelerate your campaign performance with priority placement</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {BOOST_PACKAGES.map((pkg) => (
          <Card
            key={pkg.id}
            className={cn(
              'bg-white/80 backdrop-blur-xl border rounded-2xl shadow-sm transition-all duration-200 relative overflow-hidden',
              pkg.popular ? 'border-[#2D4F97]/30 shadow-lg shadow-[#2D4F97]/10 scale-[1.02] lg:scale-105' : 'border-gray-100 hover:shadow-md'
            )}
          >
            {pkg.popular && (
              <div className="absolute top-0 right-0">
                <div className="bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] text-white text-[10px] font-bold px-8 py-1 -mr-8 mt-3 rotate-45 shadow-sm">
                  POPULAR
                </div>
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={cn('w-11 h-11 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-md', pkg.gradient)}>
                  {pkg.id === 1 ? <Zap className="h-5 w-5" /> : pkg.id === 2 ? <Crown className="h-5 w-5" /> : <Rocket className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold" style={{ color: pkg.color }}>${pkg.price}</span>
                    <span className="text-xs text-gray-400">/{pkg.period}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 mb-6">
                {pkg.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center mt-0.5 shrink-0" style={{ background: pkg.color + '20' }}>
                      <Check className="h-2.5 w-2.5" style={{ color: pkg.color }} />
                    </div>
                    <span className="text-xs text-gray-600">{f}</span>
                  </div>
                ))}
              </div>

              <Button
                className={cn(
                  'w-full rounded-xl text-white shadow-lg transition-all',
                  pkg.popular
                    ? 'bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] hover:from-[#1E3A7A] hover:to-[#166A6D] shadow-[#2D4F97]/20'
                    : 'bg-gradient-to-r hover:opacity-90',
                  pkg.id === 1 ? 'from-[#1E8A8D] to-[#26B5B8] shadow-[#1E8A8D]/20' : '',
                  pkg.id === 3 ? 'from-[#18C79A] to-[#20E8B0] shadow-[#18C79A]/20' : ''
                )}
                style={!pkg.popular && pkg.id !== 1 && pkg.id !== 3 ? { background: pkg.color } : {}}
              >
                Get Started
                <ChevronRight className="h-4 w-4 ml-1.5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Timer className="h-5 w-5 text-[#2D4F97]" />
                Current Boosts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {currentBoosts.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-400">No active boosts</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                        <th className="px-5 py-4">Campaign</th>
                        <th className="px-4 py-4">Package</th>
                        <th className="px-4 py-4">Start Date</th>
                        <th className="px-4 py-4">End Date</th>
                        <th className="px-4 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentBoosts.map((b) => {
                        const cfg = STATUS_CONFIG[b.status];
                        return (
                          <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-4 text-sm font-medium text-gray-900">{b.campaign}</td>
                            <td className="px-4 py-4">
                              <Badge variant="outline" className="text-[10px] px-2 py-0 bg-[#2D4F97]/10 text-[#2D4F97] border-[#2D4F97]/20">
                                {b.package}
                              </Badge>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">{b.startDate}</td>
                            <td className="px-4 py-4 text-sm text-gray-500">{b.endDate}</td>
                            <td className="px-4 py-4">
                              <Badge
                                variant="outline"
                                className="text-[10px] px-2 py-0 capitalize"
                                style={{ background: cfg.bg, color: cfg.color, borderColor: 'transparent' }}
                              >
                                {cfg.label}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" />
                Featured Placement Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#2D4F97]/5 to-[#1E8A8D]/5 border border-[#2D4F97]/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2D4F97] to-[#1E8A8D] flex items-center justify-center text-white">
                    <Rocket className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Your Campaign</p>
                    <p className="text-[10px] text-gray-400">Featured Placement</p>
                  </div>
                  <Badge className="ml-auto bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 text-[10px]">Featured</Badge>
                </div>
                <p className="text-xs text-gray-500">Your campaign appears at the top of listings with a featured badge, getting 3x more visibility.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#1E8A8D]" />
                Priority Worker Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Workers queue</span>
                  <span className="font-semibold text-gray-900">Priority</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Task completion speed</span>
                  <span className="font-semibold text-gray-900">Up to 30% faster</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Worker quality tier</span>
                  <span className="font-semibold text-gray-900">Premium</span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Users className="h-3.5 w-3.5" />
                    <span>Boosted campaigns get first access to top-rated workers</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
