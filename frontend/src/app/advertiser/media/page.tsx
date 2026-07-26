'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Upload, Image, Video, FileText, Trash2, Grid, List,
  Download, Search, ChevronLeft, ChevronRight, X,
} from 'lucide-react';

type MediaType = 'all' | 'image' | 'video' | 'document';
type ViewMode = 'grid' | 'list';

interface MediaFile {
  id: number;
  name: string;
  type: MediaType;
  size: string;
  dimensions?: string;
  thumbnail: string;
  created_at: string;
}

const MOCK_MEDIA: MediaFile[] = [
  { id: 1, name: 'banner-homepage.jpg', type: 'image', size: '2.4 MB', dimensions: '1920x1080', thumbnail: '', created_at: '2026-07-25' },
  { id: 2, name: 'logo-transparent.png', type: 'image', size: '856 KB', dimensions: '512x512', thumbnail: '', created_at: '2026-07-24' },
  { id: 3, name: 'product-demo.mp4', type: 'video', size: '24 MB', dimensions: '1080x1920', thumbnail: '', created_at: '2026-07-23' },
  { id: 4, name: 'brand-guidelines.pdf', type: 'document', size: '1.2 MB', thumbnail: '', created_at: '2026-07-22' },
  { id: 5, name: 'social-post-1.jpg', type: 'image', size: '1.8 MB', dimensions: '1080x1080', thumbnail: '', created_at: '2026-07-21' },
  { id: 6, name: 'promo-video-30s.mp4', type: 'video', size: '45 MB', dimensions: '1920x1080', thumbnail: '', created_at: '2026-07-20' },
  { id: 7, name: 'ad-creative-set-1.jpg', type: 'image', size: '3.1 MB', dimensions: '1200x628', thumbnail: '', created_at: '2026-07-19' },
  { id: 8, name: 'terms-conditions.docx', type: 'document', size: '245 KB', thumbnail: '', created_at: '2026-07-18' },
  { id: 9, name: 'instagram-story.png', type: 'image', size: '1.1 MB', dimensions: '1080x1920', thumbnail: '', created_at: '2026-07-17' },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  image: <Image className="h-5 w-5" />,
  video: <Video className="h-5 w-5" />,
  document: <FileText className="h-5 w-5" />,
};

const TYPE_COLORS: Record<string, string> = {
  image: '#2D4F97',
  video: '#1E8A8D',
  document: '#18C79A',
};

const ITEMS_PER_PAGE = 8;

const FILE_PLACEHOLDER_COLORS: Record<string, string> = {
  image: 'from-blue-100 to-blue-50',
  video: 'from-teal-100 to-teal-50',
  document: 'from-emerald-100 to-emerald-50',
};

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>(MOCK_MEDIA);
  const [activeFilter, setActiveFilter] = useState<MediaType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const filtered = files.filter((f) => {
    if (activeFilter !== 'all' && f.type !== activeFilter) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const deleteFile = (id: number) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const filters: { key: MediaType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'image', label: 'Images' },
    { key: 'video', label: 'Videos' },
    { key: 'document', label: 'Documents' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Media Library</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your uploaded media files</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex p-0.5 rounded-xl bg-gray-50 border border-gray-100">
            <button
              onClick={() => setViewMode('grid')}
              className={cn('p-2 rounded-lg transition-colors', viewMode === 'grid' ? 'bg-white shadow-sm text-[#2D4F97]' : 'text-gray-400 hover:text-gray-600')}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn('p-2 rounded-lg transition-colors', viewMode === 'list' ? 'bg-white shadow-sm text-[#2D4F97]' : 'text-gray-400 hover:text-gray-600')}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <Button className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] hover:from-[#1E3A7A] hover:to-[#166A6D] text-white shadow-lg shadow-[#2D4F97]/20">
            <Upload className="h-4 w-4 mr-2" /> Upload
          </Button>
        </div>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
        className={cn(
          'border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200',
          dragOver ? 'border-[#2D4F97] bg-[#2D4F97]/5' : 'border-gray-200 hover:border-[#2D4F97]/30 bg-white/40'
        )}
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center mx-auto mb-3">
          <Upload className={cn('h-6 w-6 transition-colors', dragOver ? 'text-[#2D4F97]' : 'text-gray-300')} />
        </div>
        <p className="text-sm font-medium text-gray-600">Drop files here or click to upload</p>
        <p className="text-xs text-gray-400 mt-1">Supports images, videos, and documents up to 50 MB</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-1.5 shadow-sm">
          <div className="flex flex-wrap gap-1">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => { setActiveFilter(f.key); setCurrentPage(1); }}
                className={cn(
                  'relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  activeFilter === f.key
                    ? 'bg-[#2D4F97] text-white shadow-md shadow-[#2D4F97]/20'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                )}
              >
                {f.label}
                <span
                  className={cn(
                    'ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold',
                    activeFilter === f.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  )}
                >
                  {f.key === 'all' ? files.length : files.filter((x) => x.type === f.key).length}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20 focus:border-[#2D4F97] focus:bg-white transition-all"
          />
        </div>
      </div>

      {paginated.length === 0 ? (
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardContent className="py-16 text-center">
            <Upload className="h-10 w-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No media files found</p>
            <button onClick={() => { setSearch(''); setActiveFilter('all'); }} className="text-xs text-[#2D4F97] hover:underline mt-1">Clear filters</button>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginated.map((file) => {
            const color = TYPE_COLORS[file.type];
            return (
              <Card key={file.id} className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm overflow-hidden group hover:shadow-md hover:border-[#2D4F97]/20 transition-all duration-200">
                <div className={cn('h-36 bg-gradient-to-br flex items-center justify-center relative', FILE_PLACEHOLDER_COLORS[file.type])}>
                  <div className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center" style={{ color }}>
                    {TYPE_ICONS[file.type]}
                  </div>
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <Badge
                    variant="outline"
                    className="absolute bottom-2 left-2 text-[10px] px-2 py-0.5 bg-white/90 border-0 capitalize"
                  >
                    {file.type}
                  </Badge>
                </div>
                <CardContent className="p-3">
                  <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-gray-400">{file.size}</span>
                    <span className="text-[10px] text-gray-400">{file.created_at}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-4">File</th>
                  <th className="px-4 py-4">Type</th>
                  <th className="px-4 py-4">Size</th>
                  <th className="px-4 py-4 hidden sm:table-cell">Dimensions</th>
                  <th className="px-4 py-4 hidden sm:table-cell">Uploaded</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((file) => (
                  <tr key={file.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: TYPE_COLORS[file.type] + '15', color: TYPE_COLORS[file.type] }}
                        >
                          {TYPE_ICONS[file.type]}
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{file.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm capitalize text-gray-500">{file.type}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{file.size}</td>
                    <td className="px-4 py-4 text-sm text-gray-500 hidden sm:table-cell">{file.dimensions || '—'}</td>
                    <td className="px-4 py-4 text-sm text-gray-500 hidden sm:table-cell">{file.created_at}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                          <Download className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteFile(file.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {filtered.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
          <p className="text-xs text-gray-400">
            Showing {(safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-500"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) pageNum = i + 1;
              else if (safePage <= 3) pageNum = i + 1;
              else if (safePage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = safePage - 2 + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    'w-8 h-8 rounded-lg text-xs font-medium transition-colors',
                    pageNum === safePage ? 'bg-[#2D4F97] text-white' : 'text-gray-500 hover:bg-gray-100'
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-500"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
