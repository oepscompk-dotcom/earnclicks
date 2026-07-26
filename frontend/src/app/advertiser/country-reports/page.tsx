'use client';

import { useState } from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Globe, BarChart3, ArrowUpDown, Eye, ChevronDown, ChevronUp,
  TrendingUp, TrendingDown, Minus, Download, MapPin, Search
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const countriesData = [
  { flag: '🇺🇸', name: 'United States', code: 'US', workers: 245000, tasksCompleted: 1850000, spend: 425000, convRate: 3.8, avgRating: 4.7, status: 'active', cities: [{ name: 'New York', workers: 52000 }, { name: 'Los Angeles', workers: 38000 }, { name: 'Chicago', workers: 29000 }, { name: 'Houston', workers: 21000 }] },
  { flag: '🇮🇳', name: 'India', code: 'IN', workers: 198000, tasksCompleted: 1420000, spend: 185000, convRate: 4.2, avgRating: 4.5, status: 'active', cities: [{ name: 'Mumbai', workers: 45000 }, { name: 'Delhi', workers: 42000 }, { name: 'Bangalore', workers: 38000 }] },
  { flag: '🇵🇭', name: 'Philippines', code: 'PH', workers: 165000, tasksCompleted: 1100000, spend: 145000, convRate: 4.5, avgRating: 4.8, status: 'active', cities: [{ name: 'Manila', workers: 55000 }, { name: 'Cebu', workers: 28000 }] },
  { flag: '🇬🇧', name: 'United Kingdom', code: 'UK', workers: 142000, tasksCompleted: 980000, spend: 210000, convRate: 3.5, avgRating: 4.6, status: 'active', cities: [{ name: 'London', workers: 48000 }, { name: 'Manchester', workers: 22000 }] },
  { flag: '🇧🇷', name: 'Brazil', code: 'BR', workers: 128000, tasksCompleted: 820000, spend: 98000, convRate: 3.9, avgRating: 4.4, status: 'active', cities: [{ name: 'Sao Paulo', workers: 35000 }, { name: 'Rio de Janeiro', workers: 25000 }] },
  { flag: '🇮🇩', name: 'Indonesia', code: 'ID', workers: 115000, tasksCompleted: 750000, spend: 82000, convRate: 4.1, avgRating: 4.3, status: 'active', cities: [{ name: 'Jakarta', workers: 32000 }, { name: 'Surabaya', workers: 15000 }] },
  { flag: '🇳🇬', name: 'Nigeria', code: 'NG', workers: 98000, tasksCompleted: 610000, spend: 65000, convRate: 4.3, avgRating: 4.2, status: 'active', cities: [{ name: 'Lagos', workers: 35000 }, { name: 'Abuja', workers: 12000 }] },
  { flag: '🇩🇪', name: 'Germany', code: 'DE', workers: 92000, tasksCompleted: 720000, spend: 185000, convRate: 3.2, avgRating: 4.6, status: 'active', cities: [{ name: 'Berlin', workers: 22000 }, { name: 'Munich', workers: 18000 }] },
  { flag: '🇰🇪', name: 'Kenya', code: 'KE', workers: 85000, tasksCompleted: 520000, spend: 45000, convRate: 4.4, avgRating: 4.3, status: 'active', cities: [{ name: 'Nairobi', workers: 28000 }, { name: 'Mombasa', workers: 11000 }] },
  { flag: '🇨🇦', name: 'Canada', code: 'CA', workers: 78000, tasksCompleted: 580000, spend: 155000, convRate: 3.6, avgRating: 4.7, status: 'active', cities: [{ name: 'Toronto', workers: 25000 }, { name: 'Vancouver', workers: 18000 }] },
  { flag: '🇦🇺', name: 'Australia', code: 'AU', workers: 65000, tasksCompleted: 490000, spend: 135000, convRate: 3.4, avgRating: 4.5, status: 'active', cities: [{ name: 'Sydney', workers: 20000 }, { name: 'Melbourne', workers: 18000 }] },
  { flag: '🇫🇷', name: 'France', code: 'FR', workers: 62000, tasksCompleted: 410000, spend: 120000, convRate: 3.3, avgRating: 4.4, status: 'active', cities: [{ name: 'Paris', workers: 22000 }, { name: 'Lyon', workers: 10000 }] },
  { flag: '🇿🇦', name: 'South Africa', code: 'ZA', workers: 55000, tasksCompleted: 340000, spend: 38000, convRate: 4.0, avgRating: 4.2, status: 'active', cities: [{ name: 'Johannesburg', workers: 15000 }, { name: 'Cape Town', workers: 12000 }] },
  { flag: '🇲🇽', name: 'Mexico', code: 'MX', workers: 52000, tasksCompleted: 310000, spend: 42000, convRate: 4.1, avgRating: 4.3, status: 'active', cities: [{ name: 'Mexico City', workers: 18000 }, { name: 'Guadalajara', workers: 10000 }] },
  { flag: '🇯🇵', name: 'Japan', code: 'JP', workers: 48000, tasksCompleted: 380000, spend: 165000, convRate: 2.8, avgRating: 4.8, status: 'active', cities: [{ name: 'Tokyo', workers: 18000 }, { name: 'Osaka', workers: 12000 }] },
  { flag: '🇻🇳', name: 'Vietnam', code: 'VN', workers: 75000, tasksCompleted: 480000, spend: 52000, convRate: 4.3, avgRating: 4.4, status: 'active', cities: [{ name: 'Ho Chi Minh', workers: 22000 }, { name: 'Hanoi', workers: 15000 }] },
];

type SortKey = 'name' | 'workers' | 'tasksCompleted' | 'spend' | 'convRate' | 'avgRating';
type SortDir = 'asc' | 'desc';

export default function CountryReportsPage() {
  const [sortKey, setSortKey] = useState<SortKey>('workers');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedCountry, setSelectedCountry] = useState<typeof countriesData[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const filteredCountries = countriesData
    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'name') return a.name.localeCompare(b.name) * dir;
      return (a[sortKey] - b[sortKey]) * dir;
    });

  const top10 = [...countriesData].sort((a, b) => b.workers - a.workers).slice(0, 10);

  const SortHeader = ({ label, sortKey: sk }: { label: string; sortKey: SortKey }) => (
    <th className="px-3 py-3 text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort(sk)}>
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </th>
  );

  const statusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'destructive'> = { active: 'success', paused: 'warning', inactive: 'destructive' };
    return <Badge variant={variants[status] || 'default'} className="text-[10px] capitalize">{status}</Badge>;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Country Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Performance breakdown by country and city</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Export Report</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl overflow-hidden">
            <CardHeader className="pb-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <CardTitle className="text-lg flex items-center gap-2"><Globe className="h-5 w-5 text-[#2D4F97]" />Country Overview</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="text" placeholder="Search country..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-48 h-9 pl-9 pr-3 rounded-lg border border-gray-200 bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-3 py-3 text-xs font-medium text-gray-500 text-left">Country</th>
                      <SortHeader label="Workers" sortKey="workers" />
                      <SortHeader label="Tasks Done" sortKey="tasksCompleted" />
                      <SortHeader label="Spend" sortKey="spend" />
                      <SortHeader label="Conv. Rate" sortKey="convRate" />
                      <SortHeader label="Avg Rating" sortKey="avgRating" />
                      <th className="px-3 py-3 text-xs font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCountries.map(c => (
                      <tr key={c.code}
                        className={cn('border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors',
                          selectedCountry?.code === c.code && 'bg-[#2D4F97]/5'
                        )}
                        onClick={() => setSelectedCountry(selectedCountry?.code === c.code ? null : c)}
                      >
                        <td className="px-3 py-3 font-medium text-gray-900">
                          <span className="mr-2">{c.flag}</span>{c.name}
                        </td>
                        <td className="px-3 py-3 text-gray-700">{c.workers.toLocaleString()}</td>
                        <td className="px-3 py-3 text-gray-700">{c.tasksCompleted.toLocaleString()}</td>
                        <td className="px-3 py-3 text-gray-700">{formatCurrency(c.spend)}</td>
                        <td className="px-3 py-3">
                          <span className={cn('font-medium', c.convRate >= 4 ? 'text-green-600' : c.convRate >= 3.5 ? 'text-yellow-600' : 'text-red-600')}>
                            {c.convRate}%
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-700">{c.avgRating.toFixed(1)}</span>
                            {c.avgRating >= 4.5 ? <TrendingUp className="h-3 w-3 text-green-500" /> : c.avgRating >= 4 ? <Minus className="h-3 w-3 text-yellow-500" /> : <TrendingDown className="h-3 w-3 text-red-500" />}
                          </div>
                        </td>
                        <td className="px-3 py-3">{statusBadge(c.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {selectedCountry && (
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><MapPin className="h-5 w-5 text-[#1E8A8D]" />{selectedCountry.flag} {selectedCountry.name} — City Breakdown</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedCountry.cities.map(city => (
                    <div key={city.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                      <span className="text-sm font-medium text-gray-700">{city.name}</span>
                      <span className="text-sm text-gray-500">{city.workers.toLocaleString()} workers</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="h-5 w-5 text-[#2D4F97]" />Top 10 Countries by Workers</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={top10} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={110} />
                  <Tooltip formatter={(value: number) => value.toLocaleString()} />
                  <Bar dataKey="workers" fill="#2D4F97" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Globe className="h-5 w-5 text-[#2D4F97]" />World Map</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64 rounded-xl bg-gradient-to-br from-[#2D4F97]/20 via-[#1E8A8D]/10 to-[#18C79A]/20 flex items-center justify-center border border-gray-100">
                <div className="text-center">
                  <Globe className="h-12 w-12 text-[#2D4F97]/40 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 font-medium">Interactive Map</p>
                  <p className="text-xs text-gray-400">Powered by geographic data</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="h-5 w-5 text-[#18C79A]" />Quick Stats</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Total Countries', value: filteredCountries.length.toString() },
                { label: 'Total Workers', value: filteredCountries.reduce((s, c) => s + c.workers, 0).toLocaleString() },
                { label: 'Total Spend', value: formatCurrency(filteredCountries.reduce((s, c) => s + c.spend, 0)) },
                { label: 'Avg Conversion', value: (filteredCountries.reduce((s, c) => s + c.convRate, 0) / filteredCountries.length).toFixed(1) + '%' },
                { label: 'Avg Rating', value: (filteredCountries.reduce((s, c) => s + c.avgRating, 0) / filteredCountries.length).toFixed(2) },
              ].map(s => (
                <div key={s.label} className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                  <span className="text-xs text-gray-500">{s.label}</span>
                  <span className="text-sm font-bold text-gray-900">{s.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
