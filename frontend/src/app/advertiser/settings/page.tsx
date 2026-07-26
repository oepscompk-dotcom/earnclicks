'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Settings, Globe, Bell, CreditCard, Key, Puzzle,
  Save, Copy, Trash2, ToggleLeft, ToggleRight,
  Plus, Link, Unlink, CheckCircle,
} from 'lucide-react';

type SettingsTab = 'general' | 'notifications' | 'billing' | 'api' | 'integrations';

interface ApiKey {
  id: number;
  name: string;
  key: string;
  created: string;
  active: boolean;
}

interface Integration {
  id: number;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
}

const MOCK_API_KEYS: ApiKey[] = [
  { id: 1, name: 'Production', key: 'ec_prod_••••••a3f8', created: '2026-06-15', active: true },
  { id: 2, name: 'Development', key: 'ec_dev_••••••b2c1', created: '2026-07-01', active: true },
];

const MOCK_INTEGRATIONS: Integration[] = [
  { id: 1, name: 'Google Analytics', description: 'Track campaign traffic and conversions', icon: 'GA', connected: true },
  { id: 2, name: 'Facebook Pixel', description: 'Measure ad performance on Facebook', icon: 'FP', connected: true },
  { id: 3, name: 'Slack', description: 'Receive campaign alerts in Slack', icon: 'SL', connected: false },
  { id: 4, name: 'Zapier', description: 'Automate workflows with 5000+ apps', icon: 'ZP', connected: false },
  { id: 5, name: 'Mailchimp', description: 'Sync your email marketing lists', icon: 'MC', connected: false },
];

const TABS: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { key: 'general', label: 'General', icon: <Globe className="h-4 w-4" /> },
  { key: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
  { key: 'billing', label: 'Billing', icon: <CreditCard className="h-4 w-4" /> },
  { key: 'api', label: 'API Access', icon: <Key className="h-4 w-4" /> },
  { key: 'integrations', label: 'Integrations', icon: <Puzzle className="h-4 w-4" /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(MOCK_API_KEYS);
  const [integrations, setIntegrations] = useState<Integration[]>(MOCK_INTEGRATIONS);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  const [generalForm, setGeneralForm] = useState({
    language: 'en',
    timezone: 'UTC',
    currency: 'USDT',
    dateFormat: 'MM/DD/YYYY',
  });

  const [notifForm, setNotifForm] = useState({
    emailCampaigns: true,
    emailReports: true,
    emailBilling: true,
    pushEnabled: false,
    smsEnabled: false,
  });

  const [billingForm, setBillingForm] = useState({
    defaultPayment: 'USDT (TRC20)',
    autoRecharge: false,
    autoRechargeAmount: 500,
    invoiceEmail: true,
    invoicePdf: false,
  });

  const [apiForm, setApiForm] = useState({
    webhookUrl: 'https://api.earnclicks.app/webhooks/callback',
    ipWhitelist: '192.168.1.100, 203.0.113.0/24',
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  const generateKey = () => {
    if (!newKeyName.trim()) return;
    setApiKeys((prev) => [
      { id: prev.length + 1, name: newKeyName, key: `ec_${Math.random().toString(36).slice(2, 10)}_••••${Math.random().toString(36).slice(2, 6)}`, created: new Date().toISOString().slice(0, 10), active: true },
      ...prev,
    ]);
    setNewKeyName('');
  };

  const revokeKey = (id: number) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const toggleIntegration = (id: number) => {
    setIntegrations((prev) => prev.map((i) => i.id === id ? { ...i, connected: !i.connected } : i));
  };

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) => (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0',
        enabled ? 'bg-[#18C79A]' : 'bg-gray-200'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200',
          enabled && 'translate-x-6'
        )}
      />
    </button>
  );

  const renderGeneral = () => (
    <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
      <CardHeader><CardTitle className="text-lg">General Settings</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Site Language</Label>
            <select value={generalForm.language} onChange={(e) => setGeneralForm({ ...generalForm, language: e.target.value })} className="w-full h-10 rounded-xl border border-gray-200 bg-background px-3 text-sm">
              <option value="en">English</option>
              <option value="ar">Arabic</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Timezone</Label>
            <select value={generalForm.timezone} onChange={(e) => setGeneralForm({ ...generalForm, timezone: e.target.value })} className="w-full h-10 rounded-xl border border-gray-200 bg-background px-3 text-sm">
              <option value="UTC">UTC</option>
              <option value="EST">EST (UTC-5)</option>
              <option value="PST">PST (UTC-8)</option>
              <option value="CET">CET (UTC+1)</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <select value={generalForm.currency} onChange={(e) => setGeneralForm({ ...generalForm, currency: e.target.value })} className="w-full h-10 rounded-xl border border-gray-200 bg-background px-3 text-sm">
              <option value="USDT">USDT</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Date Format</Label>
            <select value={generalForm.dateFormat} onChange={(e) => setGeneralForm({ ...generalForm, dateFormat: e.target.value })} className="w-full h-10 rounded-xl border border-gray-200 bg-background px-3 text-sm">
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="rounded-xl bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] text-white">
          <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save'}
        </Button>
      </CardContent>
    </Card>
  );

  const renderNotifications = () => (
    <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
      <CardHeader><CardTitle className="text-lg">Notification Preferences</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Email Notifications</p>
          <div className="space-y-3">
            {[
              { key: 'emailCampaigns', label: 'Campaign Updates', desc: 'Status changes, approvals, and completions' },
              { key: 'emailReports', label: 'Reports', desc: 'Daily and weekly campaign performance reports' },
              { key: 'emailBilling', label: 'Billing', desc: 'Deposit confirmations, invoices, and payment alerts' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm text-gray-700">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
                <Toggle
                  enabled={notifForm[item.key as keyof typeof notifForm] as boolean}
                  onChange={(v) => setNotifForm({ ...notifForm, [item.key]: v })}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Other Notifications</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-sm text-gray-700">Push Notifications</p>
                <p className="text-xs text-gray-400">Browser push notifications for real-time alerts</p>
              </div>
              <Toggle enabled={notifForm.pushEnabled} onChange={(v) => setNotifForm({ ...notifForm, pushEnabled: v })} />
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-sm text-gray-700">SMS Alerts</p>
                <p className="text-xs text-gray-400">Critical account alerts via SMS</p>
              </div>
              <Toggle enabled={notifForm.smsEnabled} onChange={(v) => setNotifForm({ ...notifForm, smsEnabled: v })} />
            </div>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="rounded-xl bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] text-white">
          <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save'}
        </Button>
      </CardContent>
    </Card>
  );

  const renderBilling = () => (
    <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
      <CardHeader><CardTitle className="text-lg">Billing Settings</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Default Payment Method</Label>
          <select value={billingForm.defaultPayment} onChange={(e) => setBillingForm({ ...billingForm, defaultPayment: e.target.value })} className="w-full h-10 rounded-xl border border-gray-200 bg-background px-3 text-sm">
            <option>USDT (TRC20)</option>
            <option>USDT (BEP20)</option>
            <option>USDT (ERC20)</option>
            <option>Credit Card</option>
          </select>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-gray-700">Auto-Recharge</p>
              <p className="text-xs text-gray-400">Automatically recharge when balance is low</p>
            </div>
            <Toggle enabled={billingForm.autoRecharge} onChange={(v) => setBillingForm({ ...billingForm, autoRecharge: v })} />
          </div>
          {billingForm.autoRecharge && (
            <div className="space-y-2 pl-4">
              <Label>Recharge Threshold (USDT)</Label>
              <Input
                type="number"
                value={billingForm.autoRechargeAmount}
                onChange={(e) => setBillingForm({ ...billingForm, autoRechargeAmount: Number(e.target.value) })}
                className="max-w-xs"
              />
            </div>
          )}
        </div>
        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Invoice Preferences</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-gray-50">
              <div>
                <p className="text-sm text-gray-700">Email Invoices</p>
                <p className="text-xs text-gray-400">Receive invoices via email</p>
              </div>
              <Toggle enabled={billingForm.invoiceEmail} onChange={(v) => setBillingForm({ ...billingForm, invoiceEmail: v })} />
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-gray-50">
              <div>
                <p className="text-sm text-gray-700">PDF Invoices</p>
                <p className="text-xs text-gray-400">Attach PDF version to invoice emails</p>
              </div>
              <Toggle enabled={billingForm.invoicePdf} onChange={(v) => setBillingForm({ ...billingForm, invoicePdf: v })} />
            </div>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="rounded-xl bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] text-white">
          <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save'}
        </Button>
      </CardContent>
    </Card>
  );

  const renderApi = () => (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
        <CardHeader><CardTitle className="text-lg">API Keys</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Input
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Key name..."
              className="max-w-xs"
              onKeyDown={(e) => e.key === 'Enter' && generateKey()}
            />
            <Button onClick={generateKey} disabled={!newKeyName.trim()} className="rounded-xl bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] text-white">
              <Plus className="h-4 w-4 mr-2" /> Create Key
            </Button>
          </div>
          {apiKeys.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No API keys</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Key</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((k) => (
                    <tr key={k.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{k.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-gray-50 px-2 py-1 rounded-lg text-gray-600">{k.key}</code>
                          <button className="text-gray-300 hover:text-gray-500"><Copy className="h-3.5 w-3.5" /></button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{k.created}</td>
                      <td className="px-4 py-3">
                        <Badge variant="success" className="text-[10px] px-2 py-0">Active</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" onClick={() => revokeKey(k.id)} className="text-red-500 hover:bg-red-50 text-xs">
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Revoke
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
        <CardHeader><CardTitle className="text-lg">Webhook URL</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Label>Webhook Endpoint</Label>
          <div className="flex items-center gap-2">
            <Input value={apiForm.webhookUrl} onChange={(e) => setApiForm({ ...apiForm, webhookUrl: e.target.value })} />
            <Button variant="outline" size="icon" className="rounded-xl shrink-0"><Copy className="h-4 w-4" /></Button>
          </div>
          <p className="text-xs text-gray-400">Receive real-time campaign events via POST requests</p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
        <CardHeader><CardTitle className="text-lg">IP Whitelist</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Label>Allowed IPs</Label>
          <textarea
            value={apiForm.ipWhitelist}
            onChange={(e) => setApiForm({ ...apiForm, ipWhitelist: e.target.value })}
            className="w-full min-h-[80px] rounded-xl border border-gray-200 bg-background px-3 py-2 text-sm"
          />
          <p className="text-xs text-gray-400">Comma-separated IP addresses or CIDR ranges</p>
          <Button onClick={handleSave} disabled={saving} className="rounded-xl bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] text-white">
            <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderIntegrations = () => (
    <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
      <CardHeader><CardTitle className="text-lg">Connected Apps</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {integrations.map((int) => (
          <div key={int.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                {int.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{int.name}</p>
                <p className="text-xs text-gray-400">{int.description}</p>
              </div>
            </div>
            <Button
              onClick={() => toggleIntegration(int.id)}
              variant={int.connected ? 'destructive' : 'default'}
              size="sm"
              className={cn(
                'rounded-xl text-xs',
                int.connected ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' : 'bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] text-white'
              )}
            >
              {int.connected ? <Unlink className="h-3.5 w-3.5 mr-1" /> : <Link className="h-3.5 w-3.5 mr-1" />}
              {int.connected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        ))}
        {saved && (
          <div className="flex items-center gap-1.5 text-sm text-emerald-600 pt-2">
            <CheckCircle className="h-4 w-4" /> Settings saved
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your account preferences and configurations</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-1.5 shadow-sm">
        <div className="flex flex-wrap gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                activeTab === tab.key
                  ? 'bg-[#2D4F97] text-white shadow-md shadow-[#2D4F97]/20'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'general' && renderGeneral()}
      {activeTab === 'notifications' && renderNotifications()}
      {activeTab === 'billing' && renderBilling()}
      {activeTab === 'api' && renderApi()}
      {activeTab === 'integrations' && renderIntegrations()}
    </div>
  );
}
