'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import {
  Save, Loader2, CheckCircle, Settings, Gift, ArrowUpCircle,
  Shield, CreditCard, Bell, Key, HardDrive, Globe, DollarSign,
  Clock, Languages, Lock, Eye, EyeOff, Network, Wallet,
  Mail, Smartphone, MessageSquare, Send, Webhook, AlertTriangle,
  Wifi, ToggleLeft
} from 'lucide-react';

const TABS = [
  { key: 'general', label: 'General', icon: <Settings className="h-4 w-4" /> },
  { key: 'rewards', label: 'Rewards', icon: <Gift className="h-4 w-4" /> },
  { key: 'withdrawals', label: 'Withdrawals', icon: <ArrowUpCircle className="h-4 w-4" /> },
  { key: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
  { key: 'payment_gateways', label: 'Payment Gateways', icon: <CreditCard className="h-4 w-4" /> },
  { key: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
  { key: 'api', label: 'API', icon: <Key className="h-4 w-4" /> },
  { key: 'storage', label: 'Storage', icon: <HardDrive className="h-4 w-4" /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('••••••••••••••••');
  const [showApiKey, setShowApiKey] = useState(false);

  const [form, setForm] = useState({
    platform_name: 'EarnClicks',
    default_currency: 'USD',
    timezone: 'UTC',
    language: 'en',
    min_reward: 0.10,
    max_reward: 10.00,
    referral_bonus_pct: 10,
    vip_bonus_pct: 5,
    default_task_reward: 0.50,
    withdrawal_min: 5,
    withdrawal_max: 1000,
    withdrawal_fee_trc20: 0,
    withdrawal_fee_bep20: 0,
    withdrawal_fee_erc20: 0,
    network_trc20: true,
    network_bep20: true,
    network_erc20: false,
    email_verification: true,
    phone_verification: false,
    two_factor: true,
    recaptcha: true,
    anti_bot: true,
    vpn_detection: false,
    usdt_trc20_enabled: true,
    usdt_trc20_wallet: '',
    usdt_trc20_confirmations: 12,
    usdt_bep20_enabled: true,
    usdt_bep20_wallet: '',
    usdt_erc20_enabled: false,
    usdt_erc20_wallet: '',
    email_notifications: true,
    smtp_host: '',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    smtp_from: '',
    push_notifications: false,
    sms_notifications: false,
    telegram_notifications: false,
    telegram_bot_token: '',
    telegram_chat_id: '',
    webhooks_url: '',
    webhook_events: [] as string[],
    rate_limit: 60,
    aws_s3_enabled: false,
    aws_bucket: '',
    aws_key: '',
    aws_secret: '',
    aws_region: '',
    local_storage: true,
  });

  const update = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const toggleWebhookEvent = (event: string) => {
    setForm(prev => ({
      ...prev,
      webhook_events: prev.webhook_events.includes(event)
        ? prev.webhook_events.filter(e => e !== event)
        : [...prev.webhook_events, event],
    }));
  };

  const handleSave = async (section: string) => {
    setSaving(true);
    try {
      await api.post('/admin/settings', { section, ...form });
      setSavedSection(section);
      setTimeout(() => setSavedSection(null), 2000);
    } catch {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const generateApiKey = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const key = Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setApiKey(key);
    update('api_key', key);
  };

  const inputCls = 'w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20 focus:border-[#2D4F97]';
  const labelCls = 'text-sm font-medium mb-1.5 block';
  const toggleCls = (on: boolean) =>
    `relative inline-flex items-center cursor-pointer`;
  const toggleTrack = (on: boolean) =>
    `w-11 h-6 rounded-full transition-colors ${on ? 'bg-[#2D4F97]' : 'bg-gray-200'}`;
  const toggleThumb = (on: boolean) =>
    `absolute top-[2px] start-[2px] bg-white border-gray-300 border rounded-full h-5 w-5 transition-all ${on ? 'translate-x-full' : ''}`;

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <label className={toggleCls(checked)}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
      <div className={toggleTrack(checked)}>
        <div className={toggleThumb(checked)} />
      </div>
    </label>
  );

  const SaveButton = ({ section }: { section: string }) => (
    <button
      onClick={() => handleSave(section)}
      disabled={saving}
      className="inline-flex items-center gap-2 bg-[#2D4F97] text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-[#2D4F97]/90 transition-colors disabled:opacity-50"
    >
      {saving && savedSection !== section ? <Loader2 className="h-4 w-4 animate-spin" /> : savedSection === section ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
      {savedSection === section ? 'Saved!' : 'Save Changes'}
    </button>
  );

  const SectionCard = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
        {icon}{title}
      </h4>
      {children}
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage platform configuration and preferences</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 overflow-x-auto">
          <div className="flex">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === t.key ? 'border-[#2D4F97] text-[#2D4F97]' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {t.icon}{t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* GENERAL */}
          {activeTab === 'general' && (
            <div className="max-w-2xl space-y-4">
              <SectionCard title="Platform Identity" icon={<Globe className="h-4 w-4 text-[#2D4F97]" />}>
                <div>
                  <label className={labelCls}>Platform Name</label>
                  <input className={inputCls} value={form.platform_name} onChange={e => update('platform_name', e.target.value)} />
                </div>
              </SectionCard>
              <SectionCard title="Regional Settings" icon={<Languages className="h-4 w-4 text-[#1E8A8D]" />}>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Default Currency</label>
                    <select className={inputCls} value={form.default_currency} onChange={e => update('default_currency', e.target.value)}>
                      <option value="USD">USD</option>
                      <option value="USDT">USDT</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Timezone</label>
                    <select className={inputCls} value={form.timezone} onChange={e => update('timezone', e.target.value)}>
                      <option value="UTC">UTC</option>
                      <option value="US/Eastern">US/Eastern</option>
                      <option value="US/Pacific">US/Pacific</option>
                      <option value="Europe/London">Europe/London</option>
                      <option value="Asia/Dubai">Asia/Dubai</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Language</label>
                    <select className={inputCls} value={form.language} onChange={e => update('language', e.target.value)}>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="ar">Arabic</option>
                    </select>
                  </div>
                </div>
              </SectionCard>
              <SaveButton section="general" />
            </div>
          )}

          {/* REWARDS */}
          {activeTab === 'rewards' && (
            <div className="max-w-2xl space-y-4">
              <SectionCard title="Reward Limits" icon={<Gift className="h-4 w-4 text-[#18C97A]" />}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Min Reward ($)</label>
                    <input type="number" step="0.01" className={inputCls} value={form.min_reward} onChange={e => update('min_reward', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div>
                    <label className={labelCls}>Max Reward ($)</label>
                    <input type="number" step="0.01" className={inputCls} value={form.max_reward} onChange={e => update('max_reward', parseFloat(e.target.value) || 0)} />
                  </div>
                </div>
              </SectionCard>
              <SectionCard title="Bonus Settings" icon={<DollarSign className="h-4 w-4 text-[#F59E0B]" />}>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Referral Bonus (%)</label>
                    <input type="number" step="0.1" className={inputCls} value={form.referral_bonus_pct} onChange={e => update('referral_bonus_pct', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div>
                    <label className={labelCls}>VIP Bonus (%)</label>
                    <input type="number" step="0.1" className={inputCls} value={form.vip_bonus_pct} onChange={e => update('vip_bonus_pct', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div>
                    <label className={labelCls}>Default Task Reward ($)</label>
                    <input type="number" step="0.01" className={inputCls} value={form.default_task_reward} onChange={e => update('default_task_reward', parseFloat(e.target.value) || 0)} />
                  </div>
                </div>
              </SectionCard>
              <SaveButton section="rewards" />
            </div>
          )}

          {/* WITHDRAWALS */}
          {activeTab === 'withdrawals' && (
            <div className="max-w-2xl space-y-4">
              <SectionCard title="Withdrawal Limits" icon={<ArrowUpCircle className="h-4 w-4 text-[#2D4F97]" />}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Min Amount ($)</label>
                    <input type="number" step="0.01" className={inputCls} value={form.withdrawal_min} onChange={e => update('withdrawal_min', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div>
                    <label className={labelCls}>Max Amount ($)</label>
                    <input type="number" step="0.01" className={inputCls} value={form.withdrawal_max} onChange={e => update('withdrawal_max', parseFloat(e.target.value) || 0)} />
                  </div>
                </div>
              </SectionCard>
              <SectionCard title="Supported Networks" icon={<Network className="h-4 w-4 text-[#1E8A8D]" />}>
                <div className="space-y-3">
                  {[
                    { key: 'network_trc20', label: 'TRC20', feeKey: 'withdrawal_fee_trc20' },
                    { key: 'network_bep20', label: 'BEP20', feeKey: 'withdrawal_fee_bep20' },
                    { key: 'network_erc20', label: 'ERC20', feeKey: 'withdrawal_fee_erc20' },
                  ].map(net => (
                    <div key={net.key} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Toggle checked={(form as any)[net.key]} onChange={v => update(net.key, v)} />
                        <span className="text-sm font-medium">{net.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500">Fee %</label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-20 rounded-lg border px-3 py-1.5 text-sm"
                          value={(form as any)[net.feeKey]}
                          onChange={e => update(net.feeKey, parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
              <SaveButton section="withdrawals" />
            </div>
          )}

          {/* SECURITY */}
          {activeTab === 'security' && (
            <div className="max-w-2xl space-y-4">
              <SectionCard title="Security Features" icon={<Lock className="h-4 w-4 text-[#2D4F97]" />}>
                <div className="space-y-3">
                  {[
                    { key: 'email_verification', label: 'Email Verification', desc: 'Require email verification on registration' },
                    { key: 'phone_verification', label: 'Phone Verification', desc: 'Require phone verification on registration' },
                    { key: 'two_factor', label: 'Two-Factor Authentication (2FA)', desc: 'Allow users to enable 2FA on their accounts' },
                    { key: 'recaptcha', label: 'reCAPTCHA', desc: 'Enable reCAPTCHA on login and registration forms' },
                    { key: 'anti_bot', label: 'Anti-Bot Protection', desc: 'Detect and block automated bot traffic' },
                    { key: 'vpn_detection', label: 'VPN Detection', desc: 'Block users connecting through VPN services' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <Toggle checked={(form as any)[item.key]} onChange={v => update(item.key, v)} />
                    </div>
                  ))}
                </div>
              </SectionCard>
              <SaveButton section="security" />
            </div>
          )}

          {/* PAYMENT GATEWAYS */}
          {activeTab === 'payment_gateways' && (
            <div className="max-w-2xl space-y-4">
              <SectionCard title="USDT TRC20" icon={<Wallet className="h-4 w-4 text-[#18C97A]" />}>
                <div className="flex items-center gap-3 mb-4">
                  <Toggle checked={form.usdt_trc20_enabled} onChange={v => update('usdt_trc20_enabled', v)} />
                  <span className="text-sm font-medium">Enabled</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className={labelCls}>Wallet Address</label>
                    <input className={inputCls} value={form.usdt_trc20_wallet} onChange={e => update('usdt_trc20_wallet', e.target.value)} placeholder="TRON wallet address" />
                  </div>
                  <div>
                    <label className={labelCls}>Min Confirmations</label>
                    <input type="number" className={inputCls} value={form.usdt_trc20_confirmations} onChange={e => update('usdt_trc20_confirmations', parseInt(e.target.value) || 0)} />
                  </div>
                </div>
              </SectionCard>
              <SectionCard title="USDT BEP20" icon={<Wallet className="h-4 w-4 text-[#1E8A8D]" />}>
                <div className="flex items-center gap-3 mb-4">
                  <Toggle checked={form.usdt_bep20_enabled} onChange={v => update('usdt_bep20_enabled', v)} />
                  <span className="text-sm font-medium">Enabled</span>
                </div>
                <div>
                  <label className={labelCls}>Wallet Address</label>
                  <input className={inputCls} value={form.usdt_bep20_wallet} onChange={e => update('usdt_bep20_wallet', e.target.value)} placeholder="BSC wallet address" />
                </div>
              </SectionCard>
              <SectionCard title="USDT ERC20" icon={<Wallet className="h-4 w-4 text-[#F59E0B]" />}>
                <div className="flex items-center gap-3 mb-4">
                  <Toggle checked={form.usdt_erc20_enabled} onChange={v => update('usdt_erc20_enabled', v)} />
                  <span className="text-sm font-medium">Enabled</span>
                </div>
                <div>
                  <label className={labelCls}>Wallet Address</label>
                  <input className={inputCls} value={form.usdt_erc20_wallet} onChange={e => update('usdt_erc20_wallet', e.target.value)} placeholder="Ethereum wallet address" />
                </div>
              </SectionCard>
              <SaveButton section="payment_gateways" />
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="max-w-2xl space-y-4">
              <SectionCard title="Notification Channels" icon={<Bell className="h-4 w-4 text-[#2D4F97]" />}>
                <div className="space-y-4">
                  {[
                    { key: 'email_notifications', label: 'Email', desc: 'Send notifications via email' },
                    { key: 'push_notifications', label: 'Push', desc: 'Send browser push notifications' },
                    { key: 'sms_notifications', label: 'SMS', desc: 'Send SMS notifications' },
                    { key: 'telegram_notifications', label: 'Telegram', desc: 'Send notifications via Telegram bot' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <Toggle checked={(form as any)[item.key]} onChange={v => update(item.key, v)} />
                    </div>
                  ))}
                </div>
              </SectionCard>
              {form.email_notifications && (
                <SectionCard title="SMTP Settings" icon={<Mail className="h-4 w-4 text-[#F59E0B]" />}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>SMTP Host</label>
                      <input className={inputCls} value={form.smtp_host} onChange={e => update('smtp_host', e.target.value)} placeholder="smtp.example.com" />
                    </div>
                    <div>
                      <label className={labelCls}>SMTP Port</label>
                      <input type="number" className={inputCls} value={form.smtp_port} onChange={e => update('smtp_port', parseInt(e.target.value) || 0)} />
                    </div>
                    <div>
                      <label className={labelCls}>SMTP Username</label>
                      <input className={inputCls} value={form.smtp_username} onChange={e => update('smtp_username', e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>SMTP Password</label>
                      <input type="password" className={inputCls} value={form.smtp_password} onChange={e => update('smtp_password', e.target.value)} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls}>From Address</label>
                      <input type="email" className={inputCls} value={form.smtp_from} onChange={e => update('smtp_from', e.target.value)} placeholder="noreply@earnclicks.com" />
                    </div>
                  </div>
                </SectionCard>
              )}
              {form.telegram_notifications && (
                <SectionCard title="Telegram Bot" icon={<Send className="h-4 w-4 text-[#26A5E4]" />}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Bot Token</label>
                      <input className={inputCls} value={form.telegram_bot_token} onChange={e => update('telegram_bot_token', e.target.value)} placeholder="123456:ABC-DEF1234" />
                    </div>
                    <div>
                      <label className={labelCls}>Chat ID</label>
                      <input className={inputCls} value={form.telegram_chat_id} onChange={e => update('telegram_chat_id', e.target.value)} placeholder="-123456789" />
                    </div>
                  </div>
                </SectionCard>
              )}
              <SaveButton section="notifications" />
            </div>
          )}

          {/* API */}
          {activeTab === 'api' && (
            <div className="max-w-2xl space-y-4">
              <SectionCard title="API Key" icon={<Key className="h-4 w-4 text-[#2D4F97]" />}>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      className={inputCls + ' pr-10 font-mono'}
                      value={apiKey}
                      readOnly
                      type={showApiKey ? 'text' : 'password'}
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <button onClick={generateApiKey} className="flex items-center gap-2 bg-[#2D4F97] text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-[#2D4F97]/90 transition-colors whitespace-nowrap">
                    <Key className="h-4 w-4" />Generate
                  </button>
                </div>
              </SectionCard>
              <SectionCard title="Webhooks" icon={<Webhook className="h-4 w-4 text-[#1E8A8D]" />}>
                <div>
                  <label className={labelCls}>Webhook URL</label>
                  <input className={inputCls} value={form.webhooks_url} onChange={e => update('webhooks_url', e.target.value)} placeholder="https://your-server.com/webhook" />
                </div>
                <div>
                  <label className={labelCls + ' mt-3'}>Events</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {['user.registered', 'user.verified', 'deposit.completed', 'withdrawal.completed', 'task.completed', 'kyc.verified'].map(event => (
                      <label key={event} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.webhook_events.includes(event)}
                          onChange={() => toggleWebhookEvent(event)}
                          className="rounded border-gray-300 text-[#2D4F97] focus:ring-[#2D4F97]"
                        />
                        <span className="text-sm">{event}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </SectionCard>
              <SectionCard title="Rate Limiting" icon={<Clock className="h-4 w-4 text-[#F59E0B]" />}>
                <div>
                  <label className={labelCls}>Rate Limit (requests per minute)</label>
                  <input type="number" className={inputCls} value={form.rate_limit} onChange={e => update('rate_limit', parseInt(e.target.value) || 0)} />
                </div>
              </SectionCard>
              <SaveButton section="api" />
            </div>
          )}

          {/* STORAGE */}
          {activeTab === 'storage' && (
            <div className="max-w-2xl space-y-4">
              <SectionCard title="Storage Drivers" icon={<HardDrive className="h-4 w-4 text-[#2D4F97]" />}>
                <div className="flex items-center justify-between py-3 border-b border-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Local Storage</p>
                    <p className="text-xs text-gray-500">Store files on the local filesystem</p>
                  </div>
                  <Toggle checked={form.local_storage} onChange={v => update('local_storage', v)} />
                </div>
              </SectionCard>
              <SectionCard title="AWS S3" icon={<HardDrive className="h-4 w-4 text-[#F59E0B]" />}>
                <div className="flex items-center gap-3 mb-4">
                  <Toggle checked={form.aws_s3_enabled} onChange={v => update('aws_s3_enabled', v)} />
                  <span className="text-sm font-medium">Enabled</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>S3 Bucket</label>
                    <input className={inputCls} value={form.aws_bucket} onChange={e => update('aws_bucket', e.target.value)} placeholder="my-bucket" />
                  </div>
                  <div>
                    <label className={labelCls}>AWS Region</label>
                    <input className={inputCls} value={form.aws_region} onChange={e => update('aws_region', e.target.value)} placeholder="us-east-1" />
                  </div>
                  <div>
                    <label className={labelCls}>Access Key ID</label>
                    <input className={inputCls} value={form.aws_key} onChange={e => update('aws_key', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Secret Access Key</label>
                    <input type="password" className={inputCls} value={form.aws_secret} onChange={e => update('aws_secret', e.target.value)} />
                  </div>
                </div>
              </SectionCard>
              <SaveButton section="storage" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}