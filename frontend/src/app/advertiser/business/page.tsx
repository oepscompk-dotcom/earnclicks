'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Building2, Upload, CheckCircle, Clock, AlertTriangle,
  Save, MapPin, FileText, CreditCard,
} from 'lucide-react';

type KYCStatus = 'verified' | 'pending' | 'unverified';

const KYC_CONFIG: Record<KYCStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  verified: { label: 'Verified', color: '#059669', bg: '#D1FAE5', icon: <CheckCircle className="h-4 w-4" /> },
  pending: { label: 'Pending Review', color: '#B45309', bg: '#FEF3C7', icon: <Clock className="h-4 w-4" /> },
  unverified: { label: 'Not Verified', color: '#B91C1C', bg: '#FEE2E2', icon: <AlertTriangle className="h-4 w-4" /> },
};

export default function BusinessProfilePage() {
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [kycStatus] = useState<KYCStatus>('verified');
  const [formData, setFormData] = useState({
    companyName: 'Acme Marketing Inc.',
    businessEmail: 'contact@acmemarketing.com',
    phone: '+1 (555) 123-4567',
    website: 'https://acmemarketing.com',
    industry: 'Digital Marketing',
    description: 'Full-service digital marketing agency specializing in social media growth and influencer campaigns.',
    country: 'United States',
    city: 'New York',
    address: '350 Fifth Avenue, Suite 301',
    billingAddress: '350 Fifth Avenue, Suite 301',
    taxId: 'TAX-987654321',
    vatNumber: 'VAT-US-123456789',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setCompanyLogo(URL.createObjectURL(file));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const kycCfg = KYC_CONFIG[kycStatus];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Business Profile</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your company information and verification</p>
        </div>
        <Badge
          variant="outline"
          className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium', kycCfg.bg, { 'border-0': true })}
          style={{ color: kycCfg.color }}
        >
          {kycCfg.icon}
          {kycCfg.label}
        </Badge>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#2D4F97]" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer',
                dragOver ? 'border-[#2D4F97] bg-[#2D4F97]/5' : 'border-gray-200 hover:border-[#2D4F97]/30'
              )}
            >
              {companyLogo ? (
                <img src={companyLogo} alt="Logo" className="w-16 h-16 rounded-xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-gray-300" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-700">Company Logo</p>
                <p className="text-xs text-gray-400 mt-0.5">Drop your logo here or click to browse. Recommended size: 512x512</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Business Email</Label>
                <Input type="email" value={formData.businessEmail} onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full h-10 rounded-xl border border-gray-200 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20 focus:border-[#2D4F97]"
                >
                  <option>Digital Marketing</option>
                  <option>E-commerce</option>
                  <option>Gaming</option>
                  <option>Finance</option>
                  <option>Technology</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full min-h-[80px] rounded-xl border border-gray-200 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20 focus:border-[#2D4F97]"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#1E8A8D]" />
              Billing Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Billing Address</Label>
              <Input value={formData.billingAddress} onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#18C79A]" />
              Tax Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tax ID</Label>
                <Input value={formData.taxId} onChange={(e) => setFormData({ ...formData, taxId: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>VAT Number</Label>
                <Input value={formData.vatNumber} onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#2D4F97]" />
              KYC Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: kycCfg.bg + '60' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: kycCfg.bg, color: kycCfg.color }}>
                  {kycCfg.icon}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: kycCfg.color }}>{kycCfg.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {kycStatus === 'verified' ? 'Your business identity has been verified successfully.' :
                     kycStatus === 'pending' ? 'Your documents are being reviewed. This usually takes 1-2 business days.' :
                     'Please submit your business verification documents to unlock all features.'}
                  </p>
                </div>
              </div>
              {kycStatus !== 'verified' && (
                <Button variant="outline" size="sm" className="rounded-xl whitespace-nowrap">
                  Submit Documents
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={saving}
            className="h-11 px-8 rounded-xl bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] hover:from-[#1E3A7A] hover:to-[#166A6D] text-white shadow-lg shadow-[#2D4F97]/20"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          {saved && (
            <div className="flex items-center gap-1.5 text-sm text-emerald-600">
              <CheckCircle className="h-4 w-4" /> Saved successfully
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
