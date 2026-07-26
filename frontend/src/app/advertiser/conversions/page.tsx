'use client';

import { useState } from 'react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUp, DollarSign, Target, ArrowRight, Copy, Check, Play,
  Activity, Link, Key, Clock, Globe, Smartphone, Users, FileCode,
} from 'lucide-react';

const SETUP_TABS = ['Website Clicks', 'App Installs', 'Lead Generation', 'Custom Conversion'] as const;

const MOCK_HISTORY = [
  { id: 1, date: '2026-07-25', campaign: 'Summer Sale', type: 'Website Click', conversions: 145, value: 7250, cost: 580 },
  { id: 2, date: '2026-07-25', campaign: 'Brand Awareness', type: 'Lead', conversions: 32, value: 4800, cost: 640 },
  { id: 3, date: '2026-07-24', campaign: 'TikTok Challenge', type: 'App Install', conversions: 210, value: 6300, cost: 840 },
  { id: 4, date: '2026-07-24', campaign: 'Facebook Growth', type: 'Lead', conversions: 18, value: 2700, cost: 360 },
  { id: 5, date: '2026-07-23', campaign: 'Summer Sale', type: 'Website Click', conversions: 98, value: 4900, cost: 392 },
  { id: 6, date: '2026-07-23', campaign: 'Telegram Boost', type: 'Custom', conversions: 55, value: 2750, cost: 330 },
];

const OVERVIEW = [
  { label: 'Total Conversions', value: '12,847', icon: <Target className="h-4 w-4" />, gradient: 'from-[#2D4F97] to-[#3B6BC8]', change: '+18.2%' },
  { label: 'Conversion Rate', value: '3.42%', icon: <TrendingUp className="h-4 w-4" />, gradient: 'from-[#1E8A8D] to-[#26B5B8]', change: '+0.8%' },
  { label: 'Cost Per Conversion', value: formatCurrency(1.24), icon: <DollarSign className="h-4 w-4" />, gradient: 'from-[#F59E0B] to-[#FBBF24]', change: '-12.4%' },
  { label: 'Revenue', value: formatCurrency(45280), icon: <Activity className="h-4 w-4" />, gradient: 'from-[#18C79A] to-[#20E8B0]', change: '+24.6%' },
];

const SETUP_INSTRUCTIONS: Record<string, { title: string; desc: string; code: string }> = {
  'Website Clicks': {
    title: 'Website Click Tracking',
    desc: 'Place this tracking pixel in the <head> section of your website to track user clicks.',
    code: `<!-- EarnClicks Conversion Pixel -->
<script>
  (function() {
    const p = document.createElement('script');
    p.src = 'https://tr.earnclicks.app/pixel.js?id=EC-PXL-' + Math.random().toString(36).slice(2,10);
    p.async = true;
    document.head.appendChild(p);
  })();
</script>
<noscript>
  <img height="1" width="1" style="display:none"
    src="https://tr.earnclicks.app/pixel.gif?id=EC-PXL-a1b2c3d4" />
</noscript>`,
  },
  'App Installs': {
    title: 'App Install Tracking',
    desc: 'Integrate our SDK or use the following URL scheme to track app installs from your campaigns.',
    code: `// EarnClicks App Install Tracking
// Android (Google Play):
intent://track?pid=earnclicks&id=EC-APP-INSTALL-a1b2c3d4#Intent;scheme=earnclicks;package=com.yourapp;end

// iOS (App Store):
https://tr.earnclicks.app/install?pid=earnclicks&id=EC-APP-INSTALL-a1b2c3d4&app=com.yourapp

// Server-side verification:
POST https://api.earnclicks.app/v1/conversions
Authorization: Bearer EC-SECRET-xxxx
{
  "event": "app_install",
  "pixel_id": "EC-PXL-a1b2c3d4",
  "advertising_id": "DEVICE_ID"
}`,
  },
  'Lead Generation': {
    title: 'Lead Generation Tracking',
    desc: 'Add this tracking code to your lead form submission handler to track form completions.',
    code: `// EarnClicks Lead Tracking
// Add to your form submission handler:
document.getElementById('leadForm').addEventListener('submit', function() {
  fetch('https://tr.earnclicks.app/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pixel_id: 'EC-PXL-a1b2c3d4',
      lead_value: document.getElementById('leadValue').value || 0,
      currency: 'USDT'
    })
  });
});

// Or use our data attribute:
<form data-ec-lead="true" data-ec-pixel="EC-PXL-a1b2c3d4">
  ...
</form>`,
  },
  'Custom Conversion': {
    title: 'Custom Conversion Tracking',
    desc: 'Define and track any custom event using our universal tracking API.',
    code: `// EarnClicks Custom Conversion Event
// Track any custom action:
window.earnClicks('track', {
  pixel_id: 'EC-PXL-a1b2c3d4',
  event: 'custom_event_name',
  value: 99.99,
  currency: 'USDT',
  metadata: {
    product_id: 'PROD-123',
    category: 'premium',
    user_tier: 'gold'
  }
});

// Or via direct API:
POST https://api.earnclicks.app/v1/conversions
Authorization: Bearer EC-SECRET-xxxx
{
  "event": "custom_event_name",
  "pixel_id": "EC-PXL-a1b2c3d4",
  "value": 99.99,
  "currency": "USDT",
  "metadata": { "key": "value" }
}`,
  },
};

export default function ConversionTrackingPage() {
  const [setupTab, setSetupTab] = useState<string>(SETUP_TABS[0]);
  const [copied, setCopied] = useState(false);

  const currentSetup = SETUP_INSTRUCTIONS[setupTab];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Conversion Tracking</h1>
        <p className="text-sm text-gray-400 mt-1">Track and manage your conversion events</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {OVERVIEW.map((m, i) => (
          <Card key={i} className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <CardContent className="p-4 lg:p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{m.label}</p>
                <div className={cn('w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center text-white', m.gradient)}>
                  {m.icon}
                </div>
              </div>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{m.value}</p>
              <p className="text-[11px] font-medium mt-0.5 text-[#18C79A]">{m.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Conversion Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-1.5">
            <div className="flex flex-wrap gap-1">
              {SETUP_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSetupTab(tab)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    setupTab === tab
                      ? 'bg-[#2D4F97] text-white shadow-md shadow-[#2D4F97]/20'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {currentSetup && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700">{currentSetup.title}</h4>
                <p className="text-xs text-gray-400 mt-1">{currentSetup.desc}</p>
              </div>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 text-xs leading-relaxed p-4 rounded-xl overflow-x-auto max-h-64">
                  <code>{currentSetup.code}</code>
                </pre>
                <button
                  onClick={() => handleCopy(currentSetup.code)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-[#18C79A]" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] hover:from-[#1E3A7A] hover:to-[#166A6D] text-white text-sm font-medium shadow-lg shadow-[#2D4F97]/20 transition-all duration-200">
                <Play className="h-3.5 w-3.5" /> Test Conversion Event
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#2D4F97]" /> Pixel Tracking
            </CardTitle>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#D1FAE5] text-[#059669]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              Active
            </span>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Pixel ID</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5 font-mono">EC-PXL-a1b2c3d4</p>
              </div>
              <button onClick={() => handleCopy('EC-PXL-a1b2c3d4')} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
                {copied ? <Check className="h-3.5 w-3.5 text-[#18C79A]" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Test Events</p>
              <div className="grid grid-cols-3 gap-2">
                <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:border-[#2D4F97]/30 hover:bg-[#2D4F97]/5 transition-all text-gray-500 hover:text-[#2D4F97]">
                  <Play className="h-4 w-4" />
                  <span className="text-[10px] font-medium">Page View</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:border-[#2D4F97]/30 hover:bg-[#2D4F97]/5 transition-all text-gray-500 hover:text-[#2D4F97]">
                  <Play className="h-4 w-4" />
                  <span className="text-[10px] font-medium">Click</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:border-[#2D4F97]/30 hover:bg-[#2D4F97]/5 transition-all text-gray-500 hover:text-[#2D4F97]">
                  <Play className="h-4 w-4" />
                  <span className="text-[10px] font-medium">Lead</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Link className="h-4 w-4 text-[#1E8A8D]" /> API Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Webhook URL</p>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 text-xs font-mono bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-gray-700 truncate">
                    https://api.earnclicks.app/v1/conversions/webhook
                  </code>
                  <button onClick={() => handleCopy('https://api.earnclicks.app/v1/conversions/webhook')} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                    {copied ? <Check className="h-3.5 w-3.5 text-[#18C79A]" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Secret Key</p>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 text-xs font-mono bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-gray-700 truncate">
                    EC-SECRET-••••••••••••••••
                  </code>
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                    <Key className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-100 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 shadow-sm transition-colors">
                <FileCode className="h-3.5 w-3.5" /> Documentation
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-100 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 shadow-sm transition-colors">
                <Activity className="h-3.5 w-3.5" /> Test API
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Conversion History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-4">Date</th>
                  <th className="px-4 py-4">Campaign</th>
                  <th className="px-4 py-4">Type</th>
                  <th className="px-4 py-4 text-right">Conversions</th>
                  <th className="px-4 py-4 text-right">Value</th>
                  <th className="px-4 py-4 text-right">Cost</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_HISTORY.map((h, i) => (
                  <tr key={h.id} className={cn('border-b border-gray-50 hover:bg-[#2D4F97]/[0.02] transition-colors', i === MOCK_HISTORY.length - 1 && 'border-b-0')}>
                    <td className="px-5 py-4"><p className="text-sm text-gray-600">{formatDate(h.date)}</p></td>
                    <td className="px-4 py-4"><p className="text-sm font-semibold text-gray-900">{h.campaign}</p></td>
                    <td className="px-4 py-4"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-[#2D4F97]/10 text-[#2D4F97]">{h.type}</span></td>
                    <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{h.conversions.toLocaleString()}</td>
                    <td className="px-4 py-4 text-right text-sm font-medium text-[#18C79A]">{formatCurrency(h.value)}</td>
                    <td className="px-4 py-4 text-right text-sm font-medium text-gray-700">{formatCurrency(h.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
