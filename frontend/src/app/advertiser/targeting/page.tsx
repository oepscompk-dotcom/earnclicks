'use client';

import { useState } from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Globe, MapPin, Search, ChevronDown, Users, Plus, Minus,
  ToggleLeft, ToggleRight, SlidersHorizontal, Crosshair, X
} from 'lucide-react';

const worldRegions = [
  { id: 'na', name: 'North America', countries: ['US', 'CA', 'MX'] },
  { id: 'sa', name: 'South America', countries: ['BR', 'AR', 'CO', 'CL', 'PE'] },
  { id: 'eu', name: 'Europe', countries: ['UK', 'DE', 'FR', 'ES', 'IT', 'NL', 'SE', 'NO'] },
  { id: 'as', name: 'Asia', countries: ['IN', 'PH', 'ID', 'TH', 'VN', 'JP', 'KR', 'SG', 'MY', 'CN'] },
  { id: 'af', name: 'Africa', countries: ['NG', 'KE', 'ZA', 'GH', 'EG'] },
  { id: 'oc', name: 'Oceania', countries: ['AU', 'NZ'] },
];

const allCountries = [
  { code: 'US', name: 'United States', flag: '🇺🇸', states: ['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Washington', 'Massachusetts'] },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', states: ['Ontario', 'British Columbia', 'Quebec', 'Alberta'] },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', states: ['Mexico City', 'Jalisco', 'Nuevo Leon'] },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', states: ['England', 'Scotland', 'Wales', 'Northern Ireland'] },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', states: ['Bavaria', 'Berlin', 'Hamburg', 'Hesse'] },
  { code: 'FR', name: 'France', flag: '🇫🇷', states: ['Ile-de-France', 'Provence', 'Auvergne'] },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', states: ['Madrid', 'Catalonia', 'Andalusia'] },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', states: ['Lombardy', 'Lazio', 'Veneto'] },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', states: ['Sao Paulo', 'Rio de Janeiro', 'Minas Gerais'] },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', states: ['Buenos Aires', 'Cordoba', 'Santa Fe'] },
  { code: 'IN', name: 'India', flag: '🇮🇳', states: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu'] },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', states: ['Metro Manila', 'Cebu', 'Davao'] },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', states: ['Jakarta', 'West Java', 'East Java'] },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', states: ['Bangkok', 'Chiang Mai', 'Phuket'] },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', states: ['Ho Chi Minh', 'Hanoi', 'Da Nang'] },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', states: ['Lagos', 'Abuja', 'Rivers'] },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', states: ['Nairobi', 'Mombasa', 'Kisumu'] },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', states: ['Gauteng', 'Western Cape', 'KZN'] },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', states: ['NSW', 'Victoria', 'Queensland'] },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', states: ['Tokyo', 'Osaka', 'Kanagawa'] },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', states: ['Seoul', 'Busan', 'Incheon'] },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', states: ['Central', 'East', 'North'] },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', states: ['Bavaria', 'Berlin', 'Hamburg'] },
];

export default function GeoTargetingPage() {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [countrySearch, setCountrySearch] = useState('');
  const [locationMode, setLocationMode] = useState<'include' | 'exclude'>('include');
  const [radiusCenter, setRadiusCenter] = useState('New York, US');
  const [radiusKm, setRadiusKm] = useState(50);

  const toggleRegion = (id: string) => {
    setSelectedRegions(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
    const region = worldRegions.find(r => r.id === id);
    if (region) {
      region.countries.forEach(c => {
        setSelectedCountries(prev => prev.includes(c) ? prev : [...prev, c]);
      });
    }
  };

  const toggleCountry = (code: string) => {
    setSelectedCountries(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
  };

  const filteredCountries = allCountries.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const estimatedAudience = 5000000 + selectedCountries.length * 250000 + (locationMode === 'include' ? 200000 : -100000);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Geo Targeting</h1>
        <p className="text-sm text-gray-500 mt-1">Define location-based targeting for your campaigns</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Globe className="h-5 w-5 text-[#2D4F97]" />World Regions</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {worldRegions.map(region => (
                  <button key={region.id} onClick={() => toggleRegion(region.id)}
                    className={cn('p-3 rounded-xl border text-left transition-all',
                      selectedRegions.includes(region.id)
                        ? 'bg-[#2D4F97]/10 border-[#2D4F97] text-[#2D4F97]'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-[#2D4F97]/30'
                    )}>
                    <p className="font-medium text-sm">{region.name}</p>
                    <p className="text-xs opacity-60 mt-0.5">{region.countries.length} countries</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><MapPin className="h-5 w-5 text-[#1E8A8D]" />Countries</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Search countries..." value={countrySearch} onChange={e => setCountrySearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20 focus:border-[#2D4F97]" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                {filteredCountries.map(c => (
                  <div key={c.code} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => toggleCountry(c.code)}>
                    <div className={cn('w-4 h-4 rounded border-2 flex items-center justify-center transition-colors',
                      selectedCountries.includes(c.code) ? 'bg-[#2D4F97] border-[#2D4F97]' : 'border-gray-300'
                    )}>
                      {selectedCountries.includes(c.code) && <span className="text-white text-[10px]">✓</span>}
                    </div>
                    <span className="text-sm">{c.flag}</span>
                    <span className="text-sm text-gray-700">{c.name}</span>
                    <span className="text-xs text-gray-400 ml-auto">{c.code}</span>
                  </div>
                ))}
              </div>
              {selectedCountries.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedCountries.map(code => {
                    const c = allCountries.find(cc => cc.code === code);
                    return (
                      <span key={code} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2D4F97]/10 text-[#2D4F97] text-xs font-medium">
                        {c?.flag} {c?.name}
                        <button onClick={() => toggleCountry(code)} className="ml-1 hover:text-red-500"><X className="h-3 w-3" /></button>
                      </span>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {selectedCountries.length > 0 && (
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><MapPin className="h-5 w-5 text-[#18C79A]" />State / City Selection</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <select value={selectedState} onChange={e => setSelectedState(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20">
                    <option value="">All states / regions</option>
                    {selectedCountries.flatMap(code => {
                      const c = allCountries.find(cc => cc.code === code);
                      return c?.states?.map(s => (
                        <option key={`${code}-${s}`} value={`${code}-${s}`}>{c.flag} {s}, {c.name}</option>
                      )) || [];
                    })}
                  </select>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setLocationMode('include')}
                      className={cn('flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all',
                        locationMode === 'include' ? 'bg-[#18C79A]/10 border-[#18C79A] text-[#18C79A]' : 'bg-gray-50 border-gray-200 text-gray-500'
                      )}>
                      <ToggleRight className="h-4 w-4" /> Include
                    </button>
                    <button onClick={() => setLocationMode('exclude')}
                      className={cn('flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all',
                        locationMode === 'exclude' ? 'bg-red-50 border-red-300 text-red-600' : 'bg-gray-50 border-gray-200 text-gray-500'
                      )}>
                      <ToggleLeft className="h-4 w-4" /> Exclude
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Crosshair className="h-5 w-5 text-[#2D4F97]" />Radius Targeting</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Center Location</label>
                  <input type="text" value={radiusCenter} onChange={e => setRadiusCenter(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Radius: {radiusKm} km</label>
                  <input type="range" min={1} max={500} value={radiusKm} onChange={e => setRadiusKm(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 accent-[#2D4F97]" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1 km</span><span>500 km</span></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><MapPin className="h-5 w-5 text-[#2D4F97]" />Location Map</CardTitle></CardHeader>
            <CardContent>
              <div className="h-48 rounded-xl bg-gradient-to-br from-[#2D4F97]/20 via-[#1E8A8D]/10 to-[#18C79A]/20 flex items-center justify-center border border-gray-100">
                <div className="text-center">
                  <Globe className="h-10 w-10 text-[#2D4F97]/40 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Interactive map loading...</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5 text-[#18C79A]" />Estimated Reach</CardTitle></CardHeader>
            <CardContent className="text-center">
              <p className="text-4xl font-bold text-[#2D4F97]">{estimatedAudience.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-2">potential workers</p>
              <div className="mt-4 p-3 rounded-xl bg-gray-50">
                <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Countries</span><span className="font-medium text-gray-700">{selectedCountries.length}</span></div>
                <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Mode</span><span className="font-medium text-gray-700 capitalize">{locationMode}</span></div>
                <div className="flex justify-between text-xs text-gray-500"><span>Radius</span><span className="font-medium text-gray-700">{radiusKm} km</span></div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full bg-[#2D4F97] hover:bg-[#2D4F97]/90 gap-2">
            <SlidersHorizontal className="h-4 w-4" /> Apply Targeting
          </Button>
        </div>
      </div>
    </div>
  );
}
