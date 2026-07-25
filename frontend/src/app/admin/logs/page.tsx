'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/toaster';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { cn } from '@/lib/utils';
import {
  ClipboardList,
  Search,
  Trash2,
  RotateCcw,
  Download,
  AlertCircle,
  Info,
  UserCheck,
  UserX,
  DollarSign,
  Shield,
  Filter,
  Calendar,
  Server,
  ArrowUpRight,
  Clock,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';

interface LogEntry {
  id: number;
  user: { name: string; email: string } | null;
  action: string;
  description: string;
  ip_address: string;
  created_at: string;
}

const actionIcons: Record<string, React.ReactNode> = {
  login: <UserCheck className="h-4 w-4" />,
  logout: <UserX className="h-4 w-4" />,
  deposit: <DollarSign className="h-4 w-4" />,
  withdrawal: <DollarSign className="h-4 w-4" />,
  security: <Shield className="h-4 w-4" />,
  error: <AlertCircle className="h-4 w-4" />,
};

const actionColors: Record<string, string> = {
  login: 'bg-blue-50 text-blue-600',
  logout: 'bg-gray-100 text-gray-600',
  deposit: 'bg-emerald-50 text-emerald-600',
  withdrawal: 'bg-red-50 text-red-600',
  security: 'bg-purple-50 text-purple-600',
  error: 'bg-yellow-50 text-yellow-600',
};

const filterOptions = [
  { label: 'All', value: '' },
  { label: 'Login', value: 'login' },
  { label: 'Logout', value: 'logout' },
  { label: 'Deposit', value: 'deposit' },
  { label: 'Withdrawal', value: 'withdrawal' },
  { label: 'Security', value: 'security' },
  { label: 'Error', value: 'error' },
];

function timeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

export default function ActivityLogsPage() {
  const { toast } = useToast();
  const { confirm } = useConfirm();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<any>('/admin/logs');
      const payload = res.data;
      setLogs(Array.isArray(payload) ? payload : payload.data || []);
    } catch {
      toast({ type: 'error', title: 'Failed to load logs' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesFilter = !activeFilter || log.action === activeFilter;
      if (!matchesFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        log.description.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.user?.name?.toLowerCase().includes(q) ||
        log.user?.email?.toLowerCase().includes(q) ||
        log.ip_address.toLowerCase().includes(q)
      );
    });
  }, [logs, activeFilter, searchQuery]);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const totalEvents = logs.length;
    const loginsToday = logs.filter(
      (l) => l.action === 'login' && new Date(l.created_at).toDateString() === today
    ).length;
    const errors = logs.filter((l) => l.action === 'error').length;
    const securityEvents = logs.filter((l) => l.action === 'security').length;
    return { totalEvents, loginsToday, errors, securityEvents };
  }, [logs]);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/admin/logs/${id}`);
      setLogs((prev) => prev.filter((l) => l.id !== id));
      toast({ type: 'success', title: 'Log entry deleted' });
    } catch {
      toast({ type: 'error', title: 'Failed to delete log entry' });
    }
  };

  const handleClearAll = async () => {
    const result = await confirm({
      title: 'Clear All Logs',
      description: 'This action is irreversible. All activity logs will be permanently deleted.',
      variant: 'danger',
      confirmLabel: 'Clear All',
    });
    if (!result) return;
    try {
      await api.post('/admin/logs/clear');
      setLogs([]);
      toast({ type: 'success', title: 'All logs cleared' });
    } catch {
      toast({ type: 'error', title: 'Failed to clear logs' });
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'User', 'Email', 'Action', 'Description', 'IP Address', 'Timestamp'];
    const rows = filteredLogs.map((log) => [
      log.id,
      log.user?.name || 'System',
      log.user?.email || '',
      log.action,
      log.description,
      log.ip_address,
      new Date(log.created_at).toISOString(),
    ]);
    const csv = [headers, ...rows].map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ type: 'success', title: `Exported ${filteredLogs.length} log entries` });
  };

  const statCards = [
    {
      label: 'Total Events',
      value: stats.totalEvents,
      icon: <ClipboardList className="h-5 w-5" />,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Logins Today',
      value: stats.loginsToday,
      icon: <UserCheck className="h-5 w-5" />,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Errors',
      value: stats.errors,
      icon: <AlertCircle className="h-5 w-5" />,
      color: 'bg-red-50 text-red-600',
    },
    {
      label: 'Security Events',
      value: stats.securityEvents,
      icon: <Shield className="h-5 w-5" />,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-sm text-gray-500 mt-1">View detailed system activity and audit trail.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchLogs} className="secondary" style={{ display: 'none' }}>
            <RefreshCw className="h-4 w-4" />
          </button>
          <button onClick={fetchLogs} className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:border-gray-300 transition-colors">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button onClick={handleExportCSV} className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:border-gray-300 transition-colors">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button onClick={handleClearAll} className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm text-red-600 hover:bg-red-100 transition-colors">
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', card.color)}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs by description, user, action, or IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setActiveFilter(opt.value)}
                className={cn(
                  'px-3.5 py-2 rounded-lg text-xs font-medium transition-all',
                  activeFilter === opt.value
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="relative">
              <div className="h-10 w-10 rounded-full border-4 border-gray-200" />
              <div className="absolute top-0 left-0 h-10 w-10 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
            </div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
              <ClipboardList className="h-7 w-7 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">No activity logs found</p>
            {(searchQuery || activeFilter) && (
              <button
                onClick={() => { setSearchQuery(''); setActiveFilter(''); }}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredLogs.map((log) => (
              <div key={log.id} className="px-6 py-4 flex items-start gap-4 hover:bg-blue-50/20 transition-colors group">
                <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5', actionColors[log.action] || 'bg-gray-100 text-gray-600')}>
                  {actionIcons[log.action] || <Info className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {log.user?.name || 'System'}
                    </span>
                    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium capitalize', actionColors[log.action] || 'bg-gray-100 text-gray-600')}>
                      {log.action}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{log.description}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0 text-right">
                  <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>{timeAgo(log.created_at)}</span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono hidden md:inline">{log.ip_address}</span>
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredLogs.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-400">
              Showing {filteredLogs.length} of {logs.length} events
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
