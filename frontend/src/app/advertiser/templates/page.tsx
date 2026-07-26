'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText, Copy, Check, Instagram, Youtube, Music,
  Send, Twitter, Star, Clock, Users, TrendingUp,
  Plus, Sparkles,
} from 'lucide-react';

interface Template {
  id: number;
  name: string;
  platform: string;
  taskType: string;
  description: string;
  useCount: number;
  popular: boolean;
}

const MOCK_TEMPLATES: Template[] = [
  { id: 1, name: 'Instagram Growth', platform: 'instagram', taskType: 'Like & Comment', description: 'Boost engagement on Instagram posts with targeted likes and comments from real users.', useCount: 1247, popular: true },
  { id: 2, name: 'YouTube Promotion', platform: 'youtube', taskType: 'Watch & Subscribe', description: 'Increase video views, watch time, and subscribers for YouTube channels.', useCount: 982, popular: true },
  { id: 3, name: 'TikTok Viral', platform: 'tiktok', taskType: 'Engagement', description: 'Kickstart TikTok videos with views, likes, and shares to trigger the algorithm.', useCount: 856, popular: true },
  { id: 4, name: 'Telegram Community', platform: 'telegram', taskType: 'Join Channel', description: 'Grow your Telegram channel or group with real active members.', useCount: 654, popular: false },
  { id: 5, name: 'Twitter Engagement', platform: 'twitter', taskType: 'Retweet & Like', description: 'Amplify Twitter posts with retweets, likes, and replies to increase reach.', useCount: 521, popular: false },
];

const PLATFORM_CONFIG: Record<string, { icon: React.ReactNode; color: string; gradient: string }> = {
  instagram: { icon: <Instagram className="h-5 w-5" />, color: '#E4405F', gradient: 'from-pink-500 to-purple-500' },
  youtube: { icon: <Youtube className="h-5 w-5" />, color: '#FF0000', gradient: 'from-red-500 to-red-600' },
  tiktok: { icon: <Music className="h-5 w-5" />, color: '#000000', gradient: 'from-gray-800 to-gray-900' },
  telegram: { icon: <Send className="h-5 w-5" />, color: '#26A5E4', gradient: 'from-blue-400 to-blue-600' },
  twitter: { icon: <Twitter className="h-5 w-5" />, color: '#1DA1F2', gradient: 'from-sky-400 to-blue-500' },
};

export default function TemplatesPage() {
  const [templates, _setTemplates] = useState<Template[]>(MOCK_TEMPLATES);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Campaign Templates</h1>
        <p className="text-sm text-gray-400 mt-1">Pre-built campaign templates to get started quickly</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => {
          const cfg = PLATFORM_CONFIG[template.platform] || PLATFORM_CONFIG.instagram;
          return (
            <Card
              key={template.id}
              className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#2D4F97]/20 transition-all duration-200 group relative overflow-hidden"
            >
              {template.popular && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 text-[10px] px-2 py-0.5 flex items-center gap-1">
                    <Star className="h-3 w-3" /> Popular
                  </Badge>
                </div>
              )}
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg', cfg.gradient)}>
                    {cfg.icon}
                  </div>
                  <div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className="mt-1 text-[10px] px-2 py-0"
                      style={{ borderColor: cfg.color + '30', color: cfg.color, background: cfg.color + '10' }}
                    >
                      {template.platform}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{template.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Users className="h-3.5 w-3.5" />
                    <span>{template.useCount.toLocaleString()} uses</span>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-xl bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] hover:from-[#1E3A7A] hover:to-[#166A6D] text-white shadow-lg shadow-[#2D4F97]/20 text-xs"
                  >
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                    Create from Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <Card className="bg-white/80 backdrop-blur-xl border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#2D4F97]/30 hover:bg-[#2D4F97]/[0.02] transition-all duration-200 cursor-pointer">
          <CardContent className="p-5 h-full flex flex-col items-center justify-center text-center min-h-[220px]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center mb-3">
              <Plus className="h-6 w-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-600">Save as Template</p>
            <p className="text-xs text-gray-400 mt-1">Save your current campaign as a reusable template</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
