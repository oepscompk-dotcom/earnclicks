'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Shield, Key, Lock, Smartphone, Monitor, Globe,
  Trash2, Plus, Copy, Check, Eye, EyeOff,
  AlertTriangle, RefreshCw, History,
} from 'lucide-react';

interface Session {
  id: number;
  device: string;
  browser: string;
  ip: string;
  last_active: string;
  current: boolean;
}

interface LoginRecord {
  id: number;
  date: string;
  ip: string;
  device: string;
  location: string;
  status: 'success' | 'failed';
}

interface ApiKey {
  id: number;
  name: string;
  key: string;
  created: string;
  last_used: string;
  active: boolean;
}

const MOCK_SESSIONS: Session[] = [
  { id: 1, device: 'Windows PC', browser: 'Chrome 124', ip: '192.168.1.100', last_active: 'Active now', current: true },
  { id: 2, device: 'iPhone 15', browser: 'Safari 18', ip: '192.168.1.101', last_active: '2 hours ago', current: false },
  { id: 3, device: 'MacBook Pro', browser: 'Firefox 127', ip: '203.0.113.45', last_active: '1 day ago', current: false },
];

const MOCK_LOGIN_HISTORY: LoginRecord[] = [
  { id: 1, date: '2026-07-26 10:30 AM', ip: '192.168.1.100', device: 'Windows PC / Chrome', location: 'New York, US', status: 'success' },
  { id: 2, date: '2026-07-26 08:15 AM', ip: '192.168.1.101', device: 'iPhone 15 / Safari', location: 'New York, US', status: 'success' },
  { id: 3, date: '2026-07-25 11:45 PM', ip: '45.67.89.123', device: 'Unknown / Firefox', location: 'Moscow, RU', status: 'failed' },
  { id: 4, date: '2026-07-25 09:00 AM', ip: '192.168.1.100', device: 'Windows PC / Chrome', location: 'New York, US', status: 'success' },
  { id: 5, date: '2026-07-24 06:30 PM', ip: '78.90.12.34', device: 'Android / Chrome', location: 'London, UK', status: 'failed' },
];

const MOCK_API_KEYS: ApiKey[] = [
  { id: 1, name: 'Production API', key: 'ec_prod_••••••••a3f8', created: '2026-06-15', last_used: '2026-07-26', active: true },
  { id: 2, name: 'Development API', key: 'ec_dev_••••••••b2c1', created: '2026-07-01', last_used: '2026-07-25', active: true },
];

export default function SecurityPage() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(MOCK_API_KEYS);
  const [newKeyName, setNewKeyName] = useState('');

  const revokeSession = (id: number) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const generateApiKey = () => {
    if (!newKeyName.trim()) return;
    const newKey: ApiKey = {
      id: apiKeys.length + 1,
      name: newKeyName,
      key: `ec_${Math.random().toString(36).slice(2, 10)}_••••••••${Math.random().toString(36).slice(2, 6)}`,
      created: new Date().toISOString().slice(0, 10),
      last_used: 'Never',
      active: true,
    };
    setApiKeys([newKey, ...apiKeys]);
    setNewKeyName('');
  };

  const revokeKey = (id: number) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const toggleShow = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const PasswordInput = ({ field, label, value, placeholder }: { field: 'current' | 'new' | 'confirm'; label: string; value: string; placeholder: string }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <Input
          type={showPasswords[field] ? 'text' : 'password'}
          value={value}
          onChange={(e) => setPasswordForm({ ...passwordForm, [field]: e.target.value })}
          placeholder={placeholder}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => toggleShow(field)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPasswords[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Security Center</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your account security and access</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#2D4F97]" />
              Two-Factor Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">Protect your account with 2FA</p>
                <p className="text-xs text-gray-400 mt-0.5">Add an extra layer of security using authenticator apps</p>
              </div>
              <button
                onClick={() => setTwoFAEnabled(!twoFAEnabled)}
                className={cn(
                  'relative w-12 h-6 rounded-full transition-colors duration-200',
                  twoFAEnabled ? 'bg-[#18C79A]' : 'bg-gray-200'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200',
                    twoFAEnabled && 'translate-x-6'
                  )}
                />
              </button>
            </div>
            {twoFAEnabled && (
              <div className="mt-4 p-3 rounded-xl bg-[#18C79A]/10 border border-[#18C79A]/20">
                <p className="text-sm text-emerald-700">2FA is enabled. Your account is protected.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#1E8A8D]" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PasswordInput field="current" label="Current Password" value={passwordForm.current} placeholder="Enter current password" />
            <PasswordInput field="new" label="New Password" value={passwordForm.new} placeholder="Enter new password" />
            <PasswordInput field="confirm" label="Confirm New Password" value={passwordForm.confirm} placeholder="Confirm new password" />
            <Button className="w-full rounded-xl bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] text-white">
              <RefreshCw className="h-4 w-4 mr-2" /> Update Password
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Monitor className="h-5 w-5 text-[#2D4F97]" />
            Active Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-4">Device</th>
                  <th className="px-4 py-4">Browser</th>
                  <th className="px-4 py-4">IP Address</th>
                  <th className="px-4 py-4">Last Active</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{s.device}</span>
                        {s.current && <Badge variant="success" className="text-[10px] px-2 py-0">Current</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{s.browser}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{s.ip}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{s.last_active}</td>
                    <td className="px-4 py-4 text-right">
                      {!s.current && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => revokeSession(s.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Revoke
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-[#1E8A8D]" />
            Login History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-4">Date & Time</th>
                  <th className="px-4 py-4">IP</th>
                  <th className="px-4 py-4">Device</th>
                  <th className="px-4 py-4">Location</th>
                  <th className="px-4 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_LOGIN_HISTORY.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-900">{r.date}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{r.ip}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{r.device}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{r.location}</td>
                    <td className="px-4 py-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px] px-2 py-0.5 capitalize',
                          r.status === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'border-red-200 bg-red-50 text-red-600'
                        )}
                      >
                        {r.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Key className="h-5 w-5 text-[#18C79A]" />
              API Keys
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Input
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Enter key name..."
              className="max-w-xs"
              onKeyDown={(e) => e.key === 'Enter' && generateApiKey()}
            />
            <Button
              onClick={generateApiKey}
              disabled={!newKeyName.trim()}
              className="rounded-xl bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] text-white"
            >
              <Plus className="h-4 w-4 mr-2" /> Generate Key
            </Button>
          </div>

          {apiKeys.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">No API keys generated yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Key</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Last Used</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((k) => (
                    <tr key={k.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{k.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-gray-50 px-2 py-1 rounded-lg text-gray-600">{k.key}</code>
                          <button className="text-gray-300 hover:text-gray-500 transition-colors">
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{k.created}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{k.last_used}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={k.active ? 'success' : 'secondary'}
                          className="text-[10px] px-2 py-0"
                        >
                          {k.active ? 'Active' : 'Revoked'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => revokeKey(k.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs"
                        >
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
    </div>
  );
}
