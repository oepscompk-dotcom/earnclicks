'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Upload, Loader2 } from 'lucide-react';

interface KycData {
  id?: number;
  status: string;
  country: string;
  document_type: string;
  verified_at: string | null;
  admin_note: string | null;
}

export default function KycPage() {
  const [kyc, setKyc] = useState<KycData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ country: '', document_type: 'passport' });
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchKyc = async () => {
      try {
        const res = await api.get<any>('/kyc');
        setKyc(res.kyc || null);
      } catch {
        setKyc(null);
      } finally {
        setLoading(false);
      }
    };
    fetchKyc();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('document_type', formData.document_type);
      if (frontFile) fd.append('document_front', frontFile);
      if (backFile) fd.append('document_back', backFile);
      if (selfieFile) fd.append('selfie', selfieFile);
      const res = await api.upload<{ message: string }>('/kyc', fd);
      setSuccess(res.message || 'KYC submitted for review.');
      setKyc({ status: 'pending', ...kyc, ...formData } as KycData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit KYC');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">KYC Verification</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Identity Verification
            {kyc && <Badge variant={kyc.status === 'approved' ? 'default' : kyc.status === 'rejected' ? 'destructive' : 'secondary'}>{kyc.status}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {kyc?.status === 'approved' ? (
            <Alert><AlertDescription>Your identity has been verified.</AlertDescription></Alert>
          ) : kyc?.status === 'pending' ? (
            <Alert><AlertDescription>Your KYC is under review.</AlertDescription></Alert>
          ) : kyc?.status === 'rejected' ? (
            <div className="space-y-4">
              <Alert variant="destructive"><AlertDescription>Rejected: {kyc.admin_note || 'Please resubmit.'}</AlertDescription></Alert>
              <KycForm formData={formData} setFormData={setFormData} frontFile={frontFile} setFrontFile={setFrontFile} backFile={backFile} setBackFile={setBackFile} selfieFile={selfieFile} setSelfieFile={setSelfieFile} success={success} error={error} submitting={submitting} onSubmit={handleSubmit} />
            </div>
          ) : (
            <KycForm formData={formData} setFormData={setFormData} frontFile={frontFile} setFrontFile={setFrontFile} backFile={backFile} setBackFile={setBackFile} selfieFile={selfieFile} setSelfieFile={setSelfieFile} success={success} error={error} submitting={submitting} onSubmit={handleSubmit} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function KycForm({ formData, setFormData, frontFile, setFrontFile, backFile, setBackFile, selfieFile, setSelfieFile, success, error, submitting, onSubmit }: any) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {success && <Alert><AlertDescription>{success}</AlertDescription></Alert>}
      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
      <div className="space-y-2">
        <Label>Country</Label>
        <Input placeholder="Your country" value={formData.country} onChange={(e: any) => setFormData({ ...formData, country: e.target.value })} required />
      </div>
      <div className="space-y-2">
        <Label>Document Type</Label>
        <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.document_type} onChange={(e: any) => setFormData({ ...formData, document_type: e.target.value })}>
          <option value="passport">Passport</option>
          <option value="drivers_license">Driver&apos;s License</option>
          <option value="national_id">National ID</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label>Front of Document</Label>
        <Input type="file" accept="image/*" onChange={(e: any) => setFrontFile(e.target.files?.[0])} required />
      </div>
      <div className="space-y-2">
        <Label>Back of Document</Label>
        <Input type="file" accept="image/*" onChange={(e: any) => setBackFile(e.target.files?.[0])} required />
      </div>
      <div className="space-y-2">
        <Label>Selfie with Document</Label>
        <Input type="file" accept="image/*" onChange={(e: any) => setSelfieFile(e.target.files?.[0])} required />
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Submit KYC
      </Button>
    </form>
  );
}
