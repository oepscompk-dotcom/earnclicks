'use client';

import { useState } from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users, Star, CheckCircle, Shield, Languages, Monitor,
  Smartphone, Tablet, ToggleLeft, ToggleRight, SlidersHorizontal,
  Award, Clock, Hash, Filter
} from 'lucide-react';

const reputationLevels = [
  { id: 'bronze', label: 'Bronze', minRep: 0, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  { id: 'silver', label: 'Silver', minRep: 500, color: 'text-gray-500', bg: 'bg-gray-50 border-gray-200' },
  { id: 'gold', label: 'Gold', minRep: 2000, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
  { id: 'platinum', label: 'Platinum', minRep: 10000, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
];

const languages = ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Hindi', 'Tagalog', 'Indonesian', 'Vietnamese', 'Arabic', 'Japanese', 'Korean', 'Chinese'];
const devices = ['Windows', 'macOS', 'Linux', 'Android', 'iOS'];
const osVersions = ['Windows 10/11', 'macOS Ventura+', 'Ubuntu 20.04+', 'Android 12+', 'iOS 16+'];

export default function WorkerTargetingPage() {
  const [minRep, setMinRep] = useState('bronze');
  const [minTasks, setMinTasks] = useState(100);
  const [minRating, setMinRating] = useState(4.0);
  const [minAccountAge, setMinAccountAge] = useState(30);
  const [vipOnly, setVipOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [selectedOS, setSelectedOS] = useState<string[]>([]);

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]);
  };

  const toggleDevice = (dev: string) => {
    setSelectedDevices(prev => prev.includes(dev) ? prev.filter(d => d !== dev) : [...prev, dev]);
  };

  const toggleOS = (os: string) => {
    setSelectedOS(prev => prev.includes(os) ? prev.filter(o => o !== os) : [...prev, os]);
  };

  const rep = reputationLevels.find(r => r.id === minRep);
  const estimatedPool = Math.round(
    2000000 *
    (1 - parseInt(minRep) * 0.05) *
    (minTasks > 500 ? 0.3 : minTasks > 100 ? 0.6 : 0.9) *
    (minRating / 5) *
    (vipOnly ? 0.1 : 1) *
    (verifiedOnly ? 0.4 : 1) *
    (1 + selectedLanguages.length * 0.1)
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Worker Targeting</h1>
        <p className="text-sm text-gray-500 mt-1">Filter workers by reputation, skills, and requirements</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Award className="h-5 w-5 text-[#2D4F97]" />Reputation & Experience</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Minimum Reputation Level</label>
                  <div className="grid grid-cols-4 gap-2">
                    {reputationLevels.map(r => (
                      <button key={r.id} onClick={() => setMinRep(r.id)}
                        className={cn('p-3 rounded-xl border text-center transition-all',
                          minRep === r.id ? `${r.bg} ${r.color} border-current` : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                        )}>
                        <Star className={cn('h-5 w-5 mx-auto mb-1', minRep === r.id ? r.color : 'text-gray-300')} />
                        <p className="text-xs font-medium">{r.label}</p>
                        <p className="text-[10px] opacity-60">{r.minRep}+ rep</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block flex items-center gap-1"><Hash className="h-4 w-4" />Min Completed Tasks</label>
                    <input type="number" value={minTasks} onChange={e => setMinTasks(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block flex items-center gap-1"><Star className="h-4 w-4" />Min Rating</label>
                    <div className="flex items-center gap-2">
                      <input type="range" min={1} max={5} step={0.1} value={minRating} onChange={e => setMinRating(Number(e.target.value))}
                        className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 accent-[#2D4F97]" />
                      <span className="text-sm font-bold text-[#2D4F97] w-8">{minRating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block flex items-center gap-1"><Clock className="h-4 w-4" />Account Age (days)</label>
                    <input type="number" value={minAccountAge} onChange={e => setMinAccountAge(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Shield className="h-5 w-5 text-[#1E8A8D]" />Worker Verification</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => setVipOnly(!vipOnly)}
                  className={cn('flex items-center gap-3 px-5 py-3 rounded-xl border transition-all',
                    vipOnly ? 'bg-[#2D4F97]/10 border-[#2D4F97]' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  )}>
                  {vipOnly ? <ToggleRight className="h-5 w-5 text-[#2D4F97]" /> : <ToggleLeft className="h-5 w-5 text-gray-400" />}
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">VIP Workers Only</p>
                    <p className="text-xs text-gray-500">Top-rated elite workers</p>
                  </div>
                </button>
                <button onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={cn('flex items-center gap-3 px-5 py-3 rounded-xl border transition-all',
                    verifiedOnly ? 'bg-[#1E8A8D]/10 border-[#1E8A8D]' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  )}>
                  {verifiedOnly ? <ToggleRight className="h-5 w-5 text-[#1E8A8D]" /> : <ToggleLeft className="h-5 w-5 text-gray-400" />}
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Verified Users Only</p>
                    <p className="text-xs text-gray-500">Identity-verified workers</p>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Languages className="h-5 w-5 text-[#18C79A]" />Language Requirements</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {languages.map(lang => (
                  <button key={lang} onClick={() => toggleLanguage(lang)}
                    className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                      selectedLanguages.includes(lang)
                        ? 'bg-[#18C79A]/10 border-[#18C79A] text-[#18C79A]'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-[#18C79A]/30'
                    )}>{lang}</button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Monitor className="h-5 w-5 text-[#2D4F97]" />Device & OS Requirements</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Device Types</label>
                <div className="flex flex-wrap gap-2">
                  {devices.map(dev => (
                    <button key={dev} onClick={() => toggleDevice(dev)}
                      className={cn('flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all',
                        selectedDevices.includes(dev)
                          ? 'bg-[#2D4F97]/10 border-[#2D4F97] text-[#2D4F97]'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-[#2D4F97]/30'
                      )}>
                      {dev === 'Windows' && <Monitor className="h-4 w-4" />}
                      {dev === 'macOS' && <Monitor className="h-4 w-4" />}
                      {dev === 'Linux' && <Monitor className="h-4 w-4" />}
                      {dev === 'Android' && <Smartphone className="h-4 w-4" />}
                      {dev === 'iOS' && <Smartphone className="h-4 w-4" />}
                      {dev}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">OS Versions</label>
                <div className="flex flex-wrap gap-2">
                  {osVersions.map(os => (
                    <button key={os} onClick={() => toggleOS(os)}
                      className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                        selectedOS.includes(os)
                          ? 'bg-[#1E8A8D]/10 border-[#1E8A8D] text-[#1E8A8D]'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-[#1E8A8D]/30'
                      )}>{os}</button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5 text-[#18C79A]" />Worker Pool Estimate</CardTitle></CardHeader>
            <CardContent className="text-center">
              <p className="text-4xl font-bold text-[#2D4F97]">{estimatedPool.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-2">available workers match criteria</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs"><span className="text-gray-500">Min Reputation</span><span className="font-medium text-gray-700">{rep?.label || 'N/A'}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Min Tasks</span><span className="font-medium text-gray-700">{minTasks.toLocaleString()}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Min Rating</span><span className="font-medium text-gray-700">{minRating.toFixed(1)}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">VIP Only</span><span className="font-medium text-gray-700">{vipOnly ? 'Yes' : 'No'}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Verified Only</span><span className="font-medium text-gray-700">{verifiedOnly ? 'Yes' : 'No'}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Languages</span><span className="font-medium text-gray-700">{selectedLanguages.length || 'Any'}</span></div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full bg-[#2D4F97] hover:bg-[#2D4F97]/90 gap-2">
            <Filter className="h-4 w-4" /> Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
