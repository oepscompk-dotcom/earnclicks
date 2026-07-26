'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Star, Zap, Crown, Clock, DollarSign, Users, TrendingUp, CheckCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

const mockFeatured = [
  { id: 1, name: 'Instagram Growth Q3', status: 'featured', budget: 500, spent: 320, reach: 45000, engagements: 3200, boostDate: '2026-07-15', endDate: '2026-08-15', type: 'homepage' },
  { id: 2, name: 'YouTube Video Boost', status: 'featured', budget: 1000, spent: 580, reach: 120000, engagements: 8900, boostDate: '2026-07-10', endDate: '2026-08-10', type: 'top_search' },
  { id: 3, name: 'TikTok Viral Campaign', status: 'featured', budget: 750, spent: 410, reach: 89000, engagements: 12400, boostDate: '2026-07-18', endDate: '2026-08-18', type: 'premium' },
];

const boostPackages = [
  { name: 'Homepage Feature', price: 99, duration: '7 days', features: ['Featured on homepage', 'Priority visibility', 'Basic analytics'], icon: <Star className="h-5 w-5" />, color: 'from-blue-500 to-blue-600' },
  { name: 'Top Search', price: 199, duration: '14 days', features: ['Top of search results', 'Homepage feature', 'Enhanced analytics', 'Priority workers'], icon: <Crown className="h-5 w-5" />, color: 'from-[#2D4F97] to-[#1E8A8D]' },
  { name: 'Premium Placement', price: 399, duration: '30 days', features: ['Premium badge', 'Top of all listings', 'VIP worker pool', 'Real-time analytics', 'Dedicated support'], icon: <Sparkles className="h-5 w-5" />, color: 'from-[#1E8A8D] to-[#18C79A]' },
];

export default function FeaturedCampaignsPage() {
  const [featured] = useState(mockFeatured);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Featured Campaigns</h1>
          <p className="text-sm text-gray-500">Boost your campaigns for maximum visibility and performance</p>
        </div>
        <Link href="/advertiser/boost">
          <Button>
            <Zap className="mr-2 h-4 w-4" />
            Boost a Campaign
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {boostPackages.map((pkg) => (
          <Card key={pkg.name} className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center space-y-4">
              <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br text-white flex items-center justify-center mx-auto', pkg.color)}>
                {pkg.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">${pkg.price}<span className="text-sm font-normal text-gray-400">/{pkg.duration}</span></p>
              </div>
              <ul className="space-y-2 text-left">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full">Get {pkg.name}</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Flame className="h-5 w-5 text-[#2D4F97]" />
            Currently Featured Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          {featured.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No featured campaigns yet</p>
          ) : (
            <div className="space-y-4">
              {featured.map((c) => (
                <div key={c.id} className="rounded-xl border border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50 p-4">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                        <Star className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{c.name}</h3>
                          <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">Featured</Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">
                          <Clock className="h-3.5 w-3.5 inline mr-1" />
                          {new Date(c.boostDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-white/80 text-gray-700 border-gray-200 capitalize">{c.type.replace('_', ' ')}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-400">Budget</p>
                      <p className="text-sm font-semibold text-gray-900">${c.budget}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Spent</p>
                      <p className="text-sm font-semibold text-gray-900">${c.spent}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Reach</p>
                      <p className="text-sm font-semibold text-gray-900">{c.reach.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Engagements</p>
                      <p className="text-sm font-semibold text-gray-900">{c.engagements.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Budget Used</span>
                      <span>{((c.spent / c.budget) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-200">
                      <div className="h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: `${(c.spent / c.budget) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#2D4F97]" />
            Why Feature Your Campaign?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { stat: '3x', label: 'More Reach', icon: <Users className="h-5 w-5" /> },
              { stat: '5x', label: 'Faster Completion', icon: <Zap className="h-5 w-5" /> },
              { stat: '2x', label: 'Higher Engagement', icon: <TrendingUp className="h-5 w-5" /> },
              { stat: '60%', label: 'Cost Reduction', icon: <DollarSign className="h-5 w-5" /> },
            ].map((item) => (
              <div key={item.label} className="text-center p-4 rounded-xl bg-gray-50">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D4F97] to-[#1E8A8D] text-white flex items-center justify-center mx-auto mb-2">
                  {item.icon}
                </div>
                <p className="text-xl font-bold text-gray-900">{item.stat}</p>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
