'use client';

import { useState } from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users, Plus, Search, ChevronDown, Globe, Calendar, Filter,
  X, Eye, UserCheck, MapPin, Layers
} from 'lucide-react';

const mockAudiences = [
  { id: 1, name: 'US Tech Professionals', description: 'Tech-savvy workers in major US tech hubs', size: 1250000, countries: ['US'], ageRange: '25-44', gender: 'All', created: '2026-01-15' },
  { id: 2, name: 'European Millennials', description: 'Millennial workers across Western Europe', size: 980000, countries: ['UK', 'DE', 'FR', 'ES'], ageRange: '22-35', gender: 'All', created: '2026-02-03' },
  { id: 3, name: 'Female Gamers Asia', description: 'Female gaming enthusiasts in Southeast Asia', size: 450000, countries: ['PH', 'ID', 'TH', 'VN'], ageRange: '18-30', gender: 'Female', created: '2026-02-20' },
  { id: 4, name: 'Latin American Freelancers', description: 'Freelance workers from Latin America', size: 680000, countries: ['BR', 'MX', 'CO', 'AR'], ageRange: '20-40', gender: 'All', created: '2026-03-10' },
  { id: 5, name: 'High Reputation Workers', description: 'Platinum & Gold reputation workers globally', size: 210000, countries: ['US', 'UK', 'CA', 'AU', 'DE'], ageRange: '25-50', gender: 'All', created: '2026-03-22' },
];

const countryOptions = ['US', 'UK', 'DE', 'FR', 'ES', 'IT', 'CA', 'AU', 'BR', 'MX', 'IN', 'PH', 'ID', 'TH', 'VN', 'NG', 'KE', 'ZA', 'AR', 'CO', 'JP', 'KR', 'SG', 'MY'];
const ageRangeOptions = ['18-24', '25-34', '35-44', '45-54', '55+'];
const genderOptions = ['All', 'Male', 'Female', 'Non-binary'];

export default function AudiencePage() {
  const [audiences] = useState(mockAudiences);
  const [selectedAudience, setSelectedAudience] = useState<typeof mockAudiences[0] | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcCountries, setCalcCountries] = useState<string[]>([]);
  const [calcAgeRange, setCalcAgeRange] = useState('');
  const [calcGender, setCalcGender] = useState('');
  const [estimatedReach, setEstimatedReach] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [countrySearch, setCountrySearch] = useState('');

  const filteredAudiences = audiences.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calcCountryOptions = countryOptions.filter(c =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const toggleCalcCountry = (country: string) => {
    setCalcCountries(prev =>
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };

  const estimateReach = () => {
    const base = 500000;
    const countryFactor = 1 + calcCountries.length * 0.15;
    const ageMap: Record<string, number> = { '18-24': 0.8, '25-34': 1.2, '35-44': 1.0, '45-54': 0.7, '55+': 0.4 };
    const ageFactor = calcAgeRange ? ageMap[calcAgeRange] || 1 : 1;
    const genderFactor = calcGender === 'All' || !calcGender ? 1 : 0.5;
    setEstimatedReach(Math.round(base * countryFactor * ageFactor * genderFactor));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audience Manager</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage your target audiences</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowCalculator(!showCalculator)} className="gap-2">
            <Layers className="h-4 w-4" /> Size Estimator
          </Button>
          <Button className="bg-[#2D4F97] hover:bg-[#2D4F97]/90 gap-2">
            <Plus className="h-4 w-4" /> Create Audience
          </Button>
        </div>
      </div>

      {showCalculator && (
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2"><Layers className="h-5 w-5 text-[#1E8A8D]" />Audience Size Estimator</CardTitle>
            <button onClick={() => setShowCalculator(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="h-4 w-4" /></button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Countries</label>
                  <input type="text" placeholder="Search countries..." value={countrySearch} onChange={e => setCountrySearch(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20 focus:border-[#2D4F97] bg-white/50 mb-2" />
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                    {calcCountryOptions.map(c => (
                      <button key={c} onClick={() => toggleCalcCountry(c)}
                        className={cn('px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
                          calcCountries.includes(c)
                            ? 'bg-[#2D4F97] text-white border-[#2D4F97]'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[#2D4F97]/30'
                        )}>{c}</button>
                    ))}
                  </div>
                  {calcCountries.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">{calcCountries.length} selected</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Age Range</label>
                    <select value={calcAgeRange} onChange={e => setCalcAgeRange(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20 bg-white/50">
                      <option value="">Any age</option>
                      {ageRangeOptions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Gender</label>
                    <select value={calcGender} onChange={e => setCalcGender(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20 bg-white/50">
                      {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
                <Button onClick={estimateReach} className="bg-[#1E8A8D] hover:bg-[#1E8A8D]/90 w-full">Estimate Reach</Button>
              </div>
              <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br from-[#2D4F97]/5 to-[#18C79A]/5 border border-dashed border-gray-200">
                {estimatedReach !== null ? (
                  <>
                    <p className="text-sm text-gray-500 mb-1">Estimated Audience Reach</p>
                    <p className="text-4xl font-bold text-[#2D4F97]">{estimatedReach.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-2">Based on selected criteria</p>
                  </>
                ) : (
                  <>
                    <Users className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-sm text-gray-400">Select criteria and estimate</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" placeholder="Search audiences..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20 focus:border-[#2D4F97] transition-all backdrop-blur-xl" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredAudiences.map(audience => (
          <Card key={audience.id}
            className={cn(
              'bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl cursor-pointer transition-all hover:shadow-md hover:border-[#2D4F97]/20',
              selectedAudience?.id === audience.id && 'ring-2 ring-[#2D4F97] border-[#2D4F97]'
            )}
            onClick={() => setSelectedAudience(selectedAudience?.id === audience.id ? null : audience)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#2D4F97]/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-[#2D4F97]" />
                </div>
                <Badge variant="outline" className="text-xs">{audience.created}</Badge>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{audience.name}</h3>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{audience.description}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{audience.size.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" />{audience.countries.join(', ')}</span>
                <span className="flex items-center gap-1"><Filter className="h-3.5 w-3.5" />{audience.ageRange}</span>
                <span className="flex items-center gap-1"><UserCheck className="h-3.5 w-3.5" />{audience.gender}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedAudience && (
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2"><Eye className="h-5 w-5 text-[#2D4F97]" />{selectedAudience.name}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setSelectedAudience(null)}><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
              <div className="p-3 rounded-xl bg-gray-50"><p className="text-xs text-gray-500">Size</p><p className="text-lg font-bold text-gray-900">{selectedAudience.size.toLocaleString()}</p></div>
              <div className="p-3 rounded-xl bg-gray-50"><p className="text-xs text-gray-500">Countries</p><p className="text-lg font-bold text-gray-900">{selectedAudience.countries.join(', ')}</p></div>
              <div className="p-3 rounded-xl bg-gray-50"><p className="text-xs text-gray-500">Age Range</p><p className="text-lg font-bold text-gray-900">{selectedAudience.ageRange}</p></div>
              <div className="p-3 rounded-xl bg-gray-50"><p className="text-xs text-gray-500">Gender</p><p className="text-lg font-bold text-gray-900">{selectedAudience.gender}</p></div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#2D4F97]/5 to-[#18C79A]/5 border border-dashed border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
              <p className="text-sm text-gray-500">{selectedAudience.description}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
