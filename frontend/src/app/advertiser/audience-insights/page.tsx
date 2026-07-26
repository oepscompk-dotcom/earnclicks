'use client';

import { useState } from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart3, PieChart, TrendingUp, Globe, Smartphone, Clock,
  Users, Download, Calendar
} from 'lucide-react';
import {
  BarChart, Bar, PieChart as RePieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const ageData = [
  { age: '18-22', male: 120000, female: 115000, other: 8000 },
  { age: '23-27', male: 210000, female: 195000, other: 15000 },
  { age: '28-32', male: 280000, female: 245000, other: 18000 },
  { age: '33-37', male: 230000, female: 210000, other: 12000 },
  { age: '38-42', male: 170000, female: 155000, other: 9000 },
  { age: '43-47', male: 110000, female: 105000, other: 6000 },
  { age: '48+', male: 80000, female: 75000, other: 4000 },
];

const genderData = [
  { name: 'Male', value: 55, color: '#2D4F97' },
  { name: 'Female', value: 41, color: '#1E8A8D' },
  { name: 'Non-binary', value: 4, color: '#18C79A' },
];

const topCountriesData = [
  { country: 'United States', workers: 520000, flag: '🇺🇸' },
  { country: 'India', workers: 380000, flag: '🇮🇳' },
  { country: 'Philippines', workers: 290000, flag: '🇵🇭' },
  { country: 'United Kingdom', workers: 210000, flag: '🇬🇧' },
  { country: 'Brazil', workers: 185000, flag: '🇧🇷' },
  { country: 'Indonesia', workers: 165000, flag: '🇮🇩' },
  { country: 'Nigeria', workers: 140000, flag: '🇳🇬' },
  { country: 'Germany', workers: 125000, flag: '🇩🇪' },
];

const languageData = [
  { language: 'English', count: 1800000 },
  { language: 'Spanish', count: 520000 },
  { language: 'Hindi', count: 410000 },
  { language: 'Portuguese', count: 290000 },
  { language: 'Tagalog', count: 260000 },
  { language: 'French', count: 230000 },
  { language: 'Indonesian', count: 200000 },
  { language: 'Arabic', count: 175000 },
];

const deviceData = [
  { name: 'Android', value: 42, color: '#2D4F97' },
  { name: 'iOS', value: 28, color: '#1E8A8D' },
  { name: 'Windows', value: 18, color: '#18C79A' },
  { name: 'macOS', value: 8, color: '#F59E0B' },
  { name: 'Linux', value: 4, color: '#6B7280' },
];

const activeHoursData = [
  { hour: '00:00', workers: 45000 },
  { hour: '02:00', workers: 28000 },
  { hour: '04:00', workers: 15000 },
  { hour: '06:00', workers: 25000 },
  { hour: '08:00', workers: 85000 },
  { hour: '10:00', workers: 145000 },
  { hour: '12:00', workers: 168000 },
  { hour: '14:00', workers: 195000 },
  { hour: '16:00', workers: 210000 },
  { hour: '18:00', workers: 225000 },
  { hour: '20:00', workers: 198000 },
  { hour: '22:00', workers: 120000 },
];

const chartCardClass = "bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl";

export default function AudienceInsightsPage() {
  const [timeframe, setTimeframe] = useState('7d');

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audience Insights</h1>
          <p className="text-sm text-gray-500 mt-1">Deep dive into your audience demographics and behavior</p>
        </div>
        <div className="flex items-center gap-2">
          {['7d', '30d', '90d'].map(t => (
            <button key={t} onClick={() => setTimeframe(t)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                timeframe === t ? 'bg-[#2D4F97] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}>{t}</button>
          ))}
          <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className={chartCardClass}>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2D4F97]/10 flex items-center justify-center"><Users className="h-5 w-5 text-[#2D4F97]" /></div>
              <div><p className="text-xs text-gray-500">Total Audience</p><p className="text-xl font-bold text-gray-900">2.85M</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className={chartCardClass}>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1E8A8D]/10 flex items-center justify-center"><Globe className="h-5 w-5 text-[#1E8A8D]" /></div>
              <div><p className="text-xs text-gray-500">Countries</p><p className="text-xl font-bold text-gray-900">87</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className={chartCardClass}>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#18C79A]/10 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-[#18C79A]" /></div>
              <div><p className="text-xs text-gray-500">Avg. Engagement</p><p className="text-xl font-bold text-gray-900">78.4%</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className={chartCardClass}>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><BarChart3 className="h-4 w-4 text-[#2D4F97]" />Age Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="age" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="male" name="Male" fill="#2D4F97" radius={[4, 4, 0, 0]} />
                <Bar dataKey="female" name="Female" fill="#1E8A8D" radius={[4, 4, 0, 0]} />
                <Bar dataKey="other" name="Non-binary" fill="#18C79A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={chartCardClass}>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><PieChart className="h-4 w-4 text-[#1E8A8D]" />Gender Breakdown</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RePieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {genderData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={chartCardClass}>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Globe className="h-4 w-4 text-[#2D4F97]" />Top Countries</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topCountriesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="country" type="category" tick={{ fontSize: 11 }} width={100} />
                <Tooltip />
                <Bar dataKey="workers" fill="#2D4F97" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={chartCardClass}>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Users className="h-4 w-4 text-[#18C79A]" />Languages</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={languageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="language" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#18C79A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={chartCardClass}>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Smartphone className="h-4 w-4 text-[#1E8A8D]" />Device Breakdown</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RePieChart>
                <Pie data={deviceData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {deviceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={chartCardClass}>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Clock className="h-4 w-4 text-[#2D4F97]" />Active Hours (24h)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={activeHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="workers" stroke="#2D4F97" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
