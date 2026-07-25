'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { getInitials, formatDate } from '@/lib/utils';
import { Shield, Clock, CheckCircle, XCircle, Search, Download, Eye, UserCheck, Ban, RefreshCw, ZoomIn } from 'lucide-react';

interface KYCUser {
  name: string;
  email: string;
}

interface KYC {
  id: number;
  user: KYCUser;
  country: string;
  document_type: 'passport' | 'national_id' | 'drivers_license';
  document_front_url: string;
  document_back_url: string | null;
  selfie_url: string;
  ai_result: 'pass' | 'fail' | 'pending';
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

interface KYCStats {
  pending: number;
  verified: number;
  rejected: number;
  total: number;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  verified: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

const aiResultColors: Record<string, string> = {
  pass: 'bg-green-100 text-green-700',
  fail: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
};

const documentTypeLabels: Record<string, string> = {
  passport: 'Passport',
  national_id: 'National ID',
  drivers_license: "Driver's License",
};

const filterTabs = ['', 'pending', 'verified', 'rejected'] as const;
const filterTabLabels = ['All', 'Pending', 'Verified', 'Rejected'] as const;

export default function KYCPage() {
  const [kycs, setKycs] = useState<KYC[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState<string>('');
  const [imageModal, setImageModal] = useState<{ url: string; label: string } | null>(null);

  const fetchKycs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filterTab) params.set('status', filterTab);
      const res = await api.get<any>(`/admin/kyc?${params}`);
      setKycs(res.data?.data || res.data || []);
    } catch {
      setKycs([]);
    } finally {
      setLoading(false);
    }
  }, [search, filterTab]);

  useEffect(() => {
    fetchKycs();
  }, [fetchKycs]);

  const approve = async (id: number) => {
    try {
      await api.post(`/admin/kyc/${id}/approve`);
      setKycs((prev) => prev.map((k) => (k.id === id ? { ...k, status: 'verified' } : k)));
    } catch {}
  };

  const reject = async (id: number) => {
    try {
      await api.post(`/admin/kyc/${id}/reject`);
      setKycs((prev) => prev.map((k) => (k.id === id ? { ...k, status: 'rejected' } : k)));
    } catch {}
  };

  const requestUpdate = async (id: number) => {
    try {
      await api.post(`/admin/kyc/${id}/request-update`);
      alert('Update requested from user.');
    } catch {}
  };

  const stats: KYCStats = kycs.reduce(
    (acc, k) => {
      if (k.status === 'pending') acc.pending++;
      if (k.status === 'verified') acc.verified++;
      if (k.status === 'rejected') acc.rejected++;
      acc.total++;
      return acc;
    },
    { pending: 0, verified: 0, rejected: 0, total: 0 }
  );

  const statCards = [
    { label: 'Pending Queue', value: stats.pending, icon: <Clock className="h-5 w-5" />, color: '#F59E0B' },
    { label: 'Verified', value: stats.verified, icon: <CheckCircle className="h-5 w-5" />, color: '#22C55E' },
    { label: 'Rejected', value: stats.rejected, icon: <XCircle className="h-5 w-5" />, color: '#EF4444' },
    { label: 'Total', value: stats.total, icon: <Shield className="h-5 w-5" />, color: '#2D4F97' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-gray-900">KYC Verification</h1>
          <p className="text-sm text-gray-500 mt-1">Verify user identity documents.</p>
        </div>
        <button className="hidden lg:flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:border-gray-300 transition-colors">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}15`, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-lg font-bold text-gray-900">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user or country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {filterTabs.map((s, i) => (
                <button
                  key={s}
                  onClick={() => setFilterTab(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filterTab === s ? 'bg-gray-900 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filterTabLabels[i]}
                </button>
              ))}
            </div>
            <span className="text-xs text-gray-400">{kycs.length} submissions</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          </div>
        ) : kycs.length === 0 ? (
          <div className="text-center py-16">
            <Shield className="h-10 w-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No KYC submissions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th className="px-4 lg:px-6 py-4">User</th>
                  <th className="px-4 py-4 hidden lg:table-cell">Country</th>
                  <th className="px-4 py-4 hidden lg:table-cell">ID Type</th>
                  <th className="px-4 py-4">Documents</th>
                  <th className="px-4 py-4 hidden lg:table-cell">AI Result</th>
                  <th className="px-4 py-4 hidden lg:table-cell">Submitted</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {kycs.map((k) => (
                  <tr key={k.id} className="border-b border-gray-50 hover:bg-blue-50/20 transition-colors">
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {getInitials(k.user.name)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{k.user.name}</p>
                          <p className="text-xs text-gray-400">{k.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-600">{k.country || '—'}</span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-600">{documentTypeLabels[k.document_type] || k.document_type}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="relative group">
                          <div
                            className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center cursor-pointer hover:border-blue-300 transition-colors overflow-hidden"
                            onClick={() => setImageModal({ url: k.document_front_url, label: 'Front ID' })}
                          >
                            <Eye className="h-4 w-4 text-gray-400" />
                          </div>
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">Front</span>
                        </div>
                        {k.document_back_url && (
                          <div className="relative group">
                            <div
                              className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center cursor-pointer hover:border-blue-300 transition-colors overflow-hidden"
                              onClick={() => setImageModal({ url: k.document_back_url as string, label: 'Back ID' })}
                            >
                              <Eye className="h-4 w-4 text-gray-400" />
                            </div>
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">Back</span>
                          </div>
                        )}
                        <div className="relative group">
                          <div
                            className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center cursor-pointer hover:border-blue-300 transition-colors overflow-hidden"
                            onClick={() => setImageModal({ url: k.selfie_url, label: 'Selfie' })}
                          >
                            <Eye className="h-4 w-4 text-gray-400" />
                          </div>
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">Selfie</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${aiResultColors[k.ai_result] || 'bg-gray-100 text-gray-700'}`}>
                        {k.ai_result}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-500">{formatDate(k.created_at)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[k.status] || 'bg-gray-100 text-gray-700'}`}>
                        {k.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setImageModal({ url: k.document_front_url, label: 'Document View' })}
                          className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                          title="View/Zoom Documents"
                        >
                          <ZoomIn className="h-4 w-4" />
                        </button>
                        {k.status === 'pending' && (
                          <>
                            <button
                              onClick={() => approve(k.id)}
                              className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                              title="Approve"
                            >
                              <UserCheck className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => reject(k.id)}
                              className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => requestUpdate(k.id)}
                              className="p-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
                              title="Request Update"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {imageModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setImageModal(null)}
        >
          <div
            className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-heading font-bold text-gray-900">{imageModal.label}</h3>
              <button
                onClick={() => setImageModal(null)}
                className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <XCircle className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 flex items-center justify-center bg-gray-50 min-h-[300px]">
              <img
                src={imageModal.url}
                alt={imageModal.label}
                className="max-w-full max-h-[60vh] rounded-xl object-contain shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML =
                    '<div class="flex flex-col items-center gap-2 text-gray-400"><ZoomIn class="h-10 w-10" /><p class="text-sm">Image preview not available</p></div>';
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
