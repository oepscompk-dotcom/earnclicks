'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

interface SiteLogos {
  header_logo: string;
  header_logo_type: string;
  footer_logo: string;
  footer_logo_type: string;
  favicon: string;
  favicon_type: string;
  site_name: string;
  site_tagline: string;
}

interface SiteSettingsContextType {
  logos: SiteLogos;
  loading: boolean;
  refreshLogos: () => Promise<void>;
  updateLogo: (type: 'header_logo' | 'footer_logo' | 'favicon', file: File) => Promise<{ url: string }>;
  removeLogo: (type: 'header_logo' | 'footer_logo' | 'favicon') => Promise<void>;
  updateSiteName: (name: string, tagline?: string) => Promise<void>;
}

const defaultLogos: SiteLogos = {
  header_logo: '',
  header_logo_type: 'svg',
  footer_logo: '',
  footer_logo_type: 'svg',
  favicon: '',
  favicon_type: 'svg',
  site_name: 'EarnClicks',
  site_tagline: 'SOCIAL TASK & REWARDS PLATFORM',
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  logos: defaultLogos,
  loading: true,
  refreshLogos: async () => {},
  updateLogo: async () => ({ url: '' }),
  removeLogo: async () => {},
  updateSiteName: async () => {},
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [logos, setLogos] = useState<SiteLogos>(defaultLogos);
  const [loading, setLoading] = useState(true);

  const getLogoUrl = useCallback((path: string): string => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('storage/logos/')) {
      const filename = path.replace('storage/logos/', '');
      return `${API_BASE_URL}/public/logos/${filename}`;
    }
    if (path.startsWith('/storage/logos/')) {
      const filename = path.replace('/storage/logos/', '');
      return `${API_BASE_URL}/public/logos/${filename}`;
    }
    return path;
  }, []);

  const refreshLogos = useCallback(async () => {
    try {
      const ts = Date.now();
      const data = await api.get<{ logos: SiteLogos }>('/public/logos');
      const bust = (url: string) => url && !url.startsWith('data:') ? `${url}?v=${ts}` : (url || '');
      setLogos({
        ...data.logos,
        header_logo: bust(getLogoUrl(data.logos.header_logo)),
        footer_logo: bust(getLogoUrl(data.logos.footer_logo)),
        favicon: bust(getLogoUrl(data.logos.favicon)),
      });
    } catch (err) {
      console.error('Failed to load site logos:', err);
    } finally {
      setLoading(false);
    }
  }, [getLogoUrl]);

  const updateLogo = useCallback(async (type: 'header_logo' | 'footer_logo' | 'favicon', file: File) => {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('file', file);

    const result = await api.upload<{ url: string; type: string; extension: string }>('/admin/cms/logos/upload', formData);
    await refreshLogos();
    return { url: getLogoUrl(result.url) };
  }, [refreshLogos, getLogoUrl]);

  const removeLogo = useCallback(async (type: 'header_logo' | 'footer_logo' | 'favicon') => {
    await api.post('/admin/cms/logos/remove', { type });
    await refreshLogos();
  }, [refreshLogos]);

  const updateSiteName = useCallback(async (name: string, tagline?: string) => {
    await api.put('/admin/cms/site-name', { site_name: name, site_tagline: tagline });
    await refreshLogos();
  }, [refreshLogos]);

  useEffect(() => {
    refreshLogos();
  }, [refreshLogos]);

  useEffect(() => {
    if (logos.favicon) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      if (logos.favicon.endsWith('.svg')) {
        link.type = 'image/svg+xml';
      } else if (logos.favicon.endsWith('.png')) {
        link.type = 'image/png';
      } else if (logos.favicon.endsWith('.ico')) {
        link.type = 'image/x-icon';
      }
      link.href = logos.favicon;
    }
  }, [logos.favicon]);

  return (
    <SiteSettingsContext.Provider value={{ logos, loading, refreshLogos, updateLogo, removeLogo, updateSiteName }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
