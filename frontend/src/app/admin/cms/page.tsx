'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/toaster';
import {
  Save, Loader2, CheckCircle, Upload, X,
  Globe, Home, Search, Share2, Settings2, Palette, FileImage
} from 'lucide-react';

interface CmsData {
  site_name: string;
  site_tagline: string;
  site_description: string;
  hero_title: string;
  hero_subtitle: string;
  cta_text: string;
  cta_url: string;
  announcement: string;
  announcement_enabled: boolean;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  ga_id: string;
  fb_pixel_id: string;
  facebook_url: string;
  twitter_url: string;
  instagram_url: string;
  youtube_url: string;
  telegram_url: string;
  discord_url: string;
  linkedin_url: string;
  maintenance_mode: boolean;
  maintenance_message: string;
  allowed_ips: string;
  theme_primary: string;
  theme_accent: string;
  theme_success: string;
}

interface Logos {
  header_logo: string;
  header_logo_type: string;
  footer_logo: string;
  favicon: string;
  favicon_type: string;
  site_name: string;
  site_tagline: string;
}

const TABS = [
  { key: 'general', label: 'General', icon: <Palette className="h-4 w-4" /> },
  { key: 'homepage', label: 'Homepage', icon: <Home className="h-4 w-4" /> },
  { key: 'seo', label: 'SEO & Meta', icon: <Search className="h-4 w-4" /> },
  { key: 'social', label: 'Social Links', icon: <Share2 className="h-4 w-4" /> },
  { key: 'maintenance', label: 'Maintenance', icon: <Settings2 className="h-4 w-4" /> },
];

const DEFAULT_FORM: CmsData = {
  site_name: '',
  site_tagline: '',
  site_description: '',
  hero_title: '',
  hero_subtitle: '',
  cta_text: '',
  cta_url: '',
  announcement: '',
  announcement_enabled: false,
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  ga_id: '',
  fb_pixel_id: '',
  facebook_url: '',
  twitter_url: '',
  instagram_url: '',
  youtube_url: '',
  telegram_url: '',
  discord_url: '',
  linkedin_url: '',
  maintenance_mode: false,
  maintenance_message: '',
  allowed_ips: '',
  theme_primary: '#2D4F97',
  theme_accent: '#1E8A8D',
  theme_success: '#18C97A',
};

const INPUT_CLS = 'w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20 focus:border-[#2D4F97] transition-all';
const LABEL_CLS = 'text-sm font-medium text-gray-700 mb-1.5 block';
const SAVE_CLS = 'inline-flex items-center gap-2 gradient-primary text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50';

export default function CmsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [footerLogoPreview, setFooterLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoDragOver, setLogoDragOver] = useState(false);
  const [faviconDragOver, setFaviconDragOver] = useState(false);
  const [footerLogoDragOver, setFooterLogoDragOver] = useState(false);
  const [bannerDragOver, setBannerDragOver] = useState(false);

  const logoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);
  const footerLogoRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<CmsData>(DEFAULT_FORM);

  const update = useCallback((key: keyof CmsData, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const [settingsRes, logosRes] = await Promise.all([
          api.get<{ settings: Record<string, string> }>('/admin/cms/settings'),
          api.get<{ logos: Logos }>('/admin/cms/logos'),
        ]);

        const s = settingsRes.settings;
        setForm({
          site_name: s.site_name ?? '',
          site_tagline: s.site_tagline ?? '',
          site_description: s.site_description ?? '',
          hero_title: s.hero_title ?? '',
          hero_subtitle: s.hero_subtitle ?? '',
          cta_text: s.cta_text ?? '',
          cta_url: s.cta_url ?? '',
          announcement: s.announcement ?? '',
          announcement_enabled: Boolean(s.announcement_enabled),
          meta_title: s.meta_title ?? '',
          meta_description: s.meta_description ?? '',
          meta_keywords: s.meta_keywords ?? '',
          ga_id: s.ga_id ?? '',
          fb_pixel_id: s.fb_pixel_id ?? '',
          facebook_url: s.facebook_url ?? '',
          twitter_url: s.twitter_url ?? '',
          instagram_url: s.instagram_url ?? '',
          youtube_url: s.youtube_url ?? '',
          telegram_url: s.telegram_url ?? '',
          discord_url: s.discord_url ?? '',
          linkedin_url: s.linkedin_url ?? '',
          maintenance_mode: Boolean(s.maintenance_mode),
          maintenance_message: s.maintenance_message ?? '',
          allowed_ips: s.allowed_ips ?? '',
          theme_primary: s.theme_primary ?? '#2D4F97',
          theme_accent: s.theme_accent ?? '#1E8A8D',
          theme_success: s.theme_success ?? '#18C97A',
        });

        const logos = logosRes.logos;
        if (logos?.header_logo) setLogoPreview(logos.header_logo);
        if (logos?.footer_logo) setFooterLogoPreview(logos.footer_logo);
        if (logos?.favicon) setFaviconPreview(logos.favicon);
      } catch {
        toast({ type: 'error', title: 'Failed to load CMS settings' });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [toast]);

  const handleSave = async (section: string) => {
    setSaving(true);
    try {
      await api.post('/admin/cms/settings', { section, ...form });
      setSavedSection(section);
      toast({ type: 'success', title: `${section.charAt(0).toUpperCase() + section.slice(1)} settings saved` });
      setTimeout(() => setSavedSection(null), 2000);
    } catch {
      toast({ type: 'error', title: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file: File, type: string) => {
    const typeMap: Record<string, string> = {
      logo: 'header_logo',
      favicon: 'favicon',
      banner: 'header_logo',
      footer_logo: 'footer_logo',
    };
    const mappedType = typeMap[type] ?? type;

    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', mappedType);

    try {
      const res = await api.upload<{ url: string; message: string }>('/admin/cms/logos/upload', fd);
      if (type === 'logo') setLogoPreview(res.url);
      else if (type === 'favicon') setFaviconPreview(res.url);
      else if (type === 'footer_logo') setFooterLogoPreview(res.url);
      else setBannerPreview(res.url);
      toast({ type: 'success', title: res.message ?? 'Upload successful' });
    } catch {
      toast({ type: 'error', title: 'Upload failed' });
    }
  };

  const handleDrop = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'logo') setLogoPreview(url);
    else if (type === 'favicon') setFaviconPreview(url);
    else if (type === 'footer_logo') setFooterLogoPreview(url);
    else setBannerPreview(url);
    setLogoDragOver(false);
    setFaviconDragOver(false);
    setFooterLogoDragOver(false);
    setBannerDragOver(false);
    handleFileUpload(file, type);
  };

  const dragCls = (drag: boolean) =>
    `relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
      drag ? 'border-[#2D4F97] bg-[#2D4F97]/5' : 'border-gray-200 hover:border-[#2D4F97]/50 hover:bg-gray-50'
    }`;

  const renderColorPicker = (label: string, key: 'theme_primary' | 'theme_accent' | 'theme_success') => (
    <div>
      <label className={LABEL_CLS}>{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={form[key]}
          onChange={e => update(key, e.target.value)}
          className="h-11 w-20 rounded-lg border border-gray-200 cursor-pointer"
        />
        <span className="text-sm text-gray-500 font-mono">{form[key]}</span>
      </div>
    </div>
  );

  const renderDropZone = (ref: React.RefObject<HTMLInputElement | null>, drag: boolean, setDrag: (v: boolean) => void, preview: string | null, type: string) => (
    <div
      className={dragCls(drag)}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => handleDrop(e, type)}
      onClick={() => ref.current?.click()}
    >
      <input ref={ref as React.Ref<HTMLInputElement>} type="file" accept="image/*" className="hidden" onChange={e => {
        const f = e.target.files?.[0];
        if (f) {
          const url = URL.createObjectURL(f);
          if (type === 'logo') setLogoPreview(url);
          else if (type === 'favicon') setFaviconPreview(url);
          else if (type === 'footer_logo') setFooterLogoPreview(url);
          else setBannerPreview(url);
          handleFileUpload(f, type);
        }
      }} />
      {preview ? (
        <div className="flex flex-col items-center gap-3">
          <img src={preview} alt="Preview" className="max-h-20 max-w-[200px] object-contain" />
          <p className="text-xs text-gray-400">Click to change</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-gray-100 p-4">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
          <p className="font-medium text-gray-700">Click to upload or drag & drop</p>
          <p className="text-xs text-gray-400">PNG, JPG, SVG, ICO (max 5MB)</p>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-[#2D4F97]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-gray-900">CMS & Branding</h1>
          <p className="text-gray-500 mt-1">Manage website content, branding, and appearance</p>
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

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <FileImage className="h-5 w-5 text-[#2D4F97]" />
                Logo & Favicon
              </h3>
              <div className="grid sm:grid-cols-3 gap-6">
                <div>
                  <label className={LABEL_CLS}>Header Logo</label>
                  {renderDropZone(logoRef, logoDragOver, setLogoDragOver, logoPreview, 'logo')}
                </div>
                <div>
                  <label className={LABEL_CLS}>Footer Logo</label>
                  {renderDropZone(footerLogoRef, footerLogoDragOver, setFooterLogoDragOver, footerLogoPreview, 'footer_logo')}
                </div>
                <div>
                  <label className={LABEL_CLS}>Favicon</label>
                  {renderDropZone(faviconRef, faviconDragOver, setFaviconDragOver, faviconPreview, 'favicon')}
                </div>
              </div>

              <hr className="border-gray-100" />

              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#2D4F97]" />
                Site Identity
              </h3>
              <div>
                <label className={LABEL_CLS}>Site Name</label>
                <input className={INPUT_CLS} value={form.site_name} onChange={e => update('site_name', e.target.value)} placeholder="EarnClicks" />
              </div>
              <div>
                <label className={LABEL_CLS}>Site Tagline</label>
                <input className={INPUT_CLS} value={form.site_tagline} onChange={e => update('site_tagline', e.target.value)} placeholder="SOCIAL TASK & REWARDS PLATFORM" />
                <p className="text-xs text-gray-400 mt-1">Displayed below the logo in the header</p>
              </div>
              <div>
                <label className={LABEL_CLS}>Site Description</label>
                <textarea className={INPUT_CLS} rows={3} value={form.site_description} onChange={e => update('site_description', e.target.value)} placeholder="Brief description of your platform" />
              </div>

              <hr className="border-gray-100" />

              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Palette className="h-5 w-5 text-[#2D4F97]" />
                Theme Colors
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {renderColorPicker('Primary', 'theme_primary')}
                {renderColorPicker('Accent', 'theme_accent')}
                {renderColorPicker('Success', 'theme_success')}
              </div>

              <button
                onClick={() => handleSave('general')}
                disabled={saving}
                className={SAVE_CLS}
              >
                {saving && savedSection !== 'general' ? <Loader2 className="h-4 w-4 animate-spin" /> : savedSection === 'general' ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {savedSection === 'general' ? 'Saved!' : 'Save General Settings'}
              </button>
            </div>
          )}

          {activeTab === 'homepage' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Home className="h-5 w-5 text-[#2D4F97]" />
                Hero Section
              </h3>
              <div>
                <label className={LABEL_CLS}>Hero Title</label>
                <input className={INPUT_CLS} value={form.hero_title} onChange={e => update('hero_title', e.target.value)} placeholder="Earn Rewards Completing Social Tasks" />
              </div>
              <div>
                <label className={LABEL_CLS}>Hero Subtitle</label>
                <textarea className={INPUT_CLS} rows={3} value={form.hero_subtitle} onChange={e => update('hero_subtitle', e.target.value)} placeholder="Subtitle text for the hero section" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLS}>CTA Text</label>
                  <input className={INPUT_CLS} value={form.cta_text} onChange={e => update('cta_text', e.target.value)} placeholder="Get Started" />
                </div>
                <div>
                  <label className={LABEL_CLS}>CTA URL</label>
                  <input className={INPUT_CLS} value={form.cta_url} onChange={e => update('cta_url', e.target.value)} placeholder="/register" />
                </div>
              </div>

              <hr className="border-gray-100" />

              <h3 className="font-semibold text-lg">Banner</h3>
              {renderDropZone(bannerRef, bannerDragOver, setBannerDragOver, bannerPreview, 'banner')}

              <hr className="border-gray-100" />

              <h3 className="font-semibold text-lg">Announcement</h3>
              <div className="flex items-center gap-3 mb-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={form.announcement_enabled} onChange={e => update('announcement_enabled', e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#2D4F97]/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D4F97]" />
                </label>
                <span className="text-sm text-gray-500">Enable Announcement</span>
              </div>
              <textarea className={INPUT_CLS} rows={3} value={form.announcement} onChange={e => update('announcement', e.target.value)} placeholder="Announcement text..." disabled={!form.announcement_enabled} />

              <button
                onClick={() => handleSave('homepage')}
                disabled={saving}
                className={SAVE_CLS}
              >
                {saving && savedSection !== 'homepage' ? <Loader2 className="h-4 w-4 animate-spin" /> : savedSection === 'homepage' ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {savedSection === 'homepage' ? 'Saved!' : 'Save Homepage Settings'}
              </button>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Search className="h-5 w-5 text-[#2D4F97]" />
                Meta Tags
              </h3>
              <div>
                <label className={LABEL_CLS}>Meta Title</label>
                <input className={INPUT_CLS} value={form.meta_title} onChange={e => update('meta_title', e.target.value)} placeholder="EarnClicks - Social Task & Rewards Platform" />
              </div>
              <div>
                <label className={LABEL_CLS}>Meta Description</label>
                <textarea className={INPUT_CLS} rows={3} value={form.meta_description} onChange={e => update('meta_description', e.target.value)} placeholder="Description for search engines" />
              </div>
              <div>
                <label className={LABEL_CLS}>Meta Keywords</label>
                <input className={INPUT_CLS} value={form.meta_keywords} onChange={e => update('meta_keywords', e.target.value)} placeholder="earn money, social tasks, rewards" />
                <p className="text-xs text-gray-400 mt-1">Comma separated keywords</p>
              </div>

              <hr className="border-gray-100" />

              <h3 className="font-semibold text-lg">Analytics</h3>
              <div>
                <label className={LABEL_CLS}>Google Analytics ID</label>
                <input className={INPUT_CLS} value={form.ga_id} onChange={e => update('ga_id', e.target.value)} placeholder="G-XXXXXXXXXX" />
              </div>
              <div>
                <label className={LABEL_CLS}>Facebook Pixel ID</label>
                <input className={INPUT_CLS} value={form.fb_pixel_id} onChange={e => update('fb_pixel_id', e.target.value)} placeholder="1234567890" />
              </div>

              <button
                onClick={() => handleSave('seo')}
                disabled={saving}
                className={SAVE_CLS}
              >
                {saving && savedSection !== 'seo' ? <Loader2 className="h-4 w-4 animate-spin" /> : savedSection === 'seo' ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {savedSection === 'seo' ? 'Saved!' : 'Save SEO Settings'}
              </button>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Share2 className="h-5 w-5 text-[#2D4F97]" />
                Social Media Links
              </h3>
              {[
                { key: 'facebook_url', label: 'Facebook URL', placeholder: 'https://facebook.com/earnclicks' },
                { key: 'twitter_url', label: 'Twitter URL', placeholder: 'https://twitter.com/earnclicks' },
                { key: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/earnclicks' },
                { key: 'youtube_url', label: 'YouTube URL', placeholder: 'https://youtube.com/@earnclicks' },
                { key: 'telegram_url', label: 'Telegram URL', placeholder: 'https://t.me/earnclicks' },
                { key: 'discord_url', label: 'Discord URL', placeholder: 'https://discord.gg/earnclicks' },
                { key: 'linkedin_url', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/company/earnclicks' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className={LABEL_CLS}>{label}</label>
                  <input
                    className={INPUT_CLS}
                    value={form[key as keyof CmsData] as string}
                    onChange={e => update(key as keyof CmsData, e.target.value)}
                    placeholder={placeholder}
                  />
                </div>
              ))}

              <button
                onClick={() => handleSave('social')}
                disabled={saving}
                className={SAVE_CLS}
              >
                {saving && savedSection !== 'social' ? <Loader2 className="h-4 w-4 animate-spin" /> : savedSection === 'social' ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {savedSection === 'social' ? 'Saved!' : 'Save Social Links'}
              </button>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-[#2D4F97]" />
                Maintenance Mode
              </h3>
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Maintenance Mode</p>
                  <p className="text-sm text-gray-500">When enabled, only allowed IPs can access the site</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={form.maintenance_mode} onChange={e => update('maintenance_mode', e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#2D4F97]/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D4F97]" />
                </label>
              </div>

              <div>
                <label className={LABEL_CLS}>Maintenance Message</label>
                <textarea className={INPUT_CLS} rows={3} value={form.maintenance_message} onChange={e => update('maintenance_message', e.target.value)} placeholder="We'll be back soon!" disabled={!form.maintenance_mode} />
              </div>
              <div>
                <label className={LABEL_CLS}>Allowed IPs</label>
                <textarea className={INPUT_CLS} rows={4} value={form.allowed_ips} onChange={e => update('allowed_ips', e.target.value)} placeholder={'192.168.1.1\n10.0.0.1\n127.0.0.1'} disabled={!form.maintenance_mode} />
                <p className="text-xs text-gray-400 mt-1">One IP address per line</p>
              </div>

              <button
                onClick={() => handleSave('maintenance')}
                disabled={saving}
                className={SAVE_CLS}
              >
                {saving && savedSection !== 'maintenance' ? <Loader2 className="h-4 w-4 animate-spin" /> : savedSection === 'maintenance' ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {savedSection === 'maintenance' ? 'Saved!' : 'Save Maintenance Settings'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
