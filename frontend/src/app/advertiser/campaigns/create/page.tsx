'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ChevronLeft, ChevronRight, Save, Send, Upload, X, Search, Check,
  Globe, Users, Settings, DollarSign, ShieldCheck, FileText,
  Target, Calendar, Clock, AlertCircle, Info, HelpCircle,
  Sliders, Image as ImageIcon
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Campaign Details', icon: FileText },
  { id: 2, label: 'Target Audience', icon: Users },
  { id: 3, label: 'Task Settings', icon: Settings },
  { id: 4, label: 'Budget', icon: DollarSign },
  { id: 5, label: 'Verification', icon: ShieldCheck },
  { id: 6, label: 'Review & Publish', icon: Globe },
];

const PLATFORMS = [
  'YouTube', 'Instagram', 'TikTok', 'Facebook', 'Twitter/X',
  'Telegram', 'Discord', 'Website', 'App Install', 'Survey', 'Custom'
];

const TASK_TYPES_BY_PLATFORM: Record<string, string[]> = {
  YouTube: ['Like', 'Subscribe', 'Comment', 'Watch', 'Share'],
  Instagram: ['Like', 'Follow', 'Comment', 'Share', 'Watch'],
  TikTok: ['Like', 'Follow', 'Share', 'Comment', 'Watch'],
  Facebook: ['Like', 'Follow', 'Share', 'Comment', 'Watch'],
  'Twitter/X': ['Like', 'Follow', 'Retweet', 'Comment', 'Watch'],
  Telegram: ['Join', 'Comment', 'Share'],
  Discord: ['Join', 'Custom'],
  Website: ['Visit', 'Click', 'Sign Up', 'Custom'],
  'App Install': ['Install', 'Open', 'Custom'],
  Survey: ['Complete', 'Custom'],
  Custom: ['Like', 'Follow', 'Subscribe', 'Share', 'Comment', 'Watch', 'Visit', 'Join', 'Custom'],
};

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Japan', 'Brazil', 'India', 'Indonesia', 'Nigeria', 'Kenya',
  'South Africa', 'Philippines', 'Vietnam', 'Thailand', 'Malaysia',
  'Singapore', 'South Korea', 'Mexico', 'Argentina', 'Colombia', 'Chile',
  'Spain', 'Italy', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Poland',
  'Turkey', 'Russia', 'UAE', 'Saudi Arabia', 'Egypt', 'Pakistan',
  'Bangladesh', 'Sri Lanka', 'Nepal', 'Ghana', 'Ethiopia', 'Morocco',
];

const STATES_BY_COUNTRY: Record<string, string[]> = {
  'United States': ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  'Canada': ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan'],
  'Australia': ['New South Wales', 'Queensland', 'South Australia', 'Tasmania', 'Victoria', 'Western Australia'],
  'India': ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'],
};

const CITIES_BY_STATE: Record<string, string[]> = {
  California: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose', 'Oakland', 'Fresno'],
  'New York': ['New York City', 'Buffalo', 'Rochester', 'Syracuse', 'Albany'],
  Texas: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
  Florida: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
  Lagos: ['Ikeja', 'Victoria Island', 'Lekki', 'Surulere'],
  Nairobi: ['Westlands', 'Kilimani', 'Karen', 'CBD'],
};

const LANGUAGES = [
  'English', 'Spanish', 'French', 'Arabic', 'Portuguese', 'German',
  'Hindi', 'Bengali', 'Indonesian', 'Japanese', 'Vietnamese', 'Turkish',
  'Korean', 'Italian', 'Dutch', 'Polish', 'Thai', 'Swahili', 'Russian',
];

const DEVICES = ['All', 'Mobile', 'Desktop', 'Tablet'];
const OPERATING_SYSTEMS = ['All', 'Android', 'iOS', 'Windows', 'Mac'];
const REPUTATION_LEVELS = ['Bronze', 'Silver', 'Gold', 'Platinum'];
const PROOF_TYPES = ['Screenshot', 'Link', 'Both'];
const FRAUD_LEVELS = ['Low', 'Medium', 'High', 'Maximum'];
const ACCOUNT_AGE_MINIMUMS = ['None', '7 days', '14 days', '30 days', '60 days', '90 days', '6 months', '1 year'];

const suggestedAmounts = [0.01, 0.05, 0.10, 0.25, 0.50, 1.00, 2.50];

function MultiSelect({ label, options, selected, onChange, placeholder }: {
  label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void; placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = options.filter((o) => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="relative">
        <div
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer items-center gap-1.5 flex-wrap min-h-[40px]"
          onClick={() => setOpen(!open)}
        >
          {selected.length === 0 ? (
            <span className="text-muted-foreground">{placeholder || `Select ${label.toLowerCase()}...`}</span>
          ) : (
            selected.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-xs px-2 py-0.5">
                {s}
                <button
                  onClick={(e) => { e.stopPropagation(); onChange(selected.filter((x) => x !== s)); }}
                  className="hover:text-primary/70"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          )}
        </div>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute z-20 mt-1 w-full rounded-lg border bg-background shadow-lg animate-slide-up">
              <div className="p-2 border-b">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 h-9"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto p-1">
                {filtered.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">No results</p>
                ) : (
                  filtered.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        onChange(
                          selected.includes(option)
                            ? selected.filter((x) => x !== option)
                            : [...selected, option]
                        );
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent"
                    >
                      <div className={cn(
                        'h-4 w-4 rounded border flex items-center justify-center shrink-0',
                        selected.includes(option) ? 'bg-primary border-primary text-primary-foreground' : 'border-input'
                      )}>
                        {selected.includes(option) && <Check className="h-3 w-3" />}
                      </div>
                      {option}
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TagInput({ label, tags, onChange, placeholder }: {
  label: string; tags: string[]; onChange: (v: string[]) => void; placeholder?: string;
}) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) {
      onChange([...tags, val]);
      setInput('');
    }
  };

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-1.5 mb-1.5">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-secondary/20 text-secondary text-xs px-2 py-0.5">
            {tag}
            <button onClick={() => onChange(tags.filter((t) => t !== tag))} className="hover:text-secondary/70">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder || `Add ${label.toLowerCase()}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
          className="flex-1"
        />
        <Button type="button" variant="outline" size="sm" onClick={addTag}>Add</Button>
      </div>
    </div>
  );
}

export default function CreateCampaignPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [animDir, setAnimDir] = useState<'left' | 'right'>('right');

  const [form, setForm] = useState({
    name: '',
    description: '',
    platform: 'Instagram',
    task_type: 'Like',
    task_url: '',
    instructions: '',
    reward_per_task: 0.10,
    total_tasks: 100,
    daily_limit: 0,
    proof_type: 'Screenshot',
    auto_approval: false,
    multiple_submissions: false,
    max_per_user: 1,
    time_limit: '',
    total_budget: 0,
    daily_budget: '',
    start_date: '',
    end_date: '',
    budget_allocation: 50,
    ad_schedule: 'all_day',
    ad_start_time: '09:00',
    ad_end_time: '18:00',
    countries: [] as string[],
    states: [] as string[],
    cities: [] as string[],
    genders: 'All' as string,
    age_min: 18,
    age_max: 65,
    languages: [] as string[],
    device: 'All',
    os: 'All',
    interests: [] as string[],
    reputation_level: 'Bronze',
    vip_only: false,
    verified_only: false,
    kyc_required: false,
    email_verify: false,
    phone_verify: false,
    ip_uniqueness: false,
    device_uniqueness: false,
    account_age_min: 'None',
    geo_match: false,
    fraud_level: 'Medium',
    media: null as File | null,
  });

  const update = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  const estimatedReach = useMemo(() => {
    if (form.reward_per_task <= 0) return 0;
    return Math.floor(form.total_budget / form.reward_per_task);
  }, [form.total_budget, form.reward_per_task]);

  const platformTaskTypes = TASK_TYPES_BY_PLATFORM[form.platform] || TASK_TYPES_BY_PLATFORM['Custom'];
  const [countrySearch, setCountrySearch] = useState('');

  const isLastStep = currentStep === STEPS.length;
  const isFirstStep = currentStep === 1;

  const goNext = () => {
    setAnimDir('right');
    setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goPrev = () => {
    setAnimDir('left');
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const handlePlatformChange = (platform: string) => {
    const types = TASK_TYPES_BY_PLATFORM[platform] || TASK_TYPES_BY_PLATFORM['Custom'];
    update('platform', platform);
    update('task_type', types[0]);
  };

  const buildPayload = () => ({
    name: form.name,
    description: form.description,
    platform: form.platform.toLowerCase().replace(' ', '_').replace('/', '_'),
    task_type: form.task_type.toLowerCase().replace(' ', '_'),
    task_url: form.task_url,
    reward_per_task: form.reward_per_task,
    total_budget: form.total_budget,
    total_tasks: form.total_tasks,
    daily_limit: form.daily_limit,
    instructions: form.instructions,
    start_date: form.start_date,
    end_date: form.end_date,
    proof_type: form.proof_type.toLowerCase(),
    auto_approval: form.auto_approval,
    multiple_submissions: form.multiple_submissions,
    max_per_user: form.max_per_user,
    time_limit: form.time_limit ? parseInt(form.time_limit) : null,
    daily_budget: form.daily_budget ? parseFloat(form.daily_budget) : null,
    budget_allocation: form.budget_allocation,
    ad_schedule: form.ad_schedule,
    ad_start_time: form.ad_start_time,
    ad_end_time: form.ad_end_time,
    targeting: {
      countries: form.countries,
      states: form.states,
      cities: form.cities,
      genders: form.genders === 'All' ? [] : [form.genders.toLowerCase()],
      age_min: form.age_min,
      age_max: form.age_max,
      languages: form.languages,
      device: form.device.toLowerCase(),
      os: form.os.toLowerCase(),
      interests: form.interests,
      reputation_level: form.reputation_level.toLowerCase(),
      vip_only: form.vip_only,
      verified_only: form.verified_only,
    },
    verification: {
      kyc: form.kyc_required,
      email_verify: form.email_verify,
      phone_verify: form.phone_verify,
      ip_uniqueness: form.ip_uniqueness,
      device_uniqueness: form.device_uniqueness,
      account_age_min: form.account_age_min,
      geo_match: form.geo_match,
      fraud_level: form.fraud_level.toLowerCase(),
    },
  });

  const handleSubmit = async (asDraft: boolean = false) => {
    setError('');
    setLoading(true);
    try {
      const payload = buildPayload();
      await api.post('/campaigns', { ...payload, status: asDraft ? 'draft' : 'pending' });
      router.push('/advertiser/campaigns');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const renderProgress = () => (
    <div className="w-full lg:w-72 shrink-0">
      <div className="lg:sticky lg:top-6 space-y-1">
        <h2 className="text-lg font-bold mb-4 hidden lg:block">Campaign Setup</h2>
        {STEPS.map((step, idx) => {
          const isActive = currentStep === step.id;
          const isComplete = currentStep > step.id;
          const Icon = step.icon;
          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={cn(
                'flex items-center gap-3 w-full rounded-xl px-4 py-3 text-left transition-all duration-300',
                isActive && 'bg-primary/10 text-primary font-medium',
                isComplete && 'text-green-600',
                !isActive && !isComplete && 'text-muted-foreground hover:bg-muted/50'
              )}
            >
              <div className={cn(
                'relative flex items-center justify-center w-9 h-9 rounded-full shrink-0 transition-all duration-300',
                isActive && 'bg-primary text-primary-foreground shadow-lg shadow-primary/20',
                isComplete && 'bg-green-500 text-white',
                !isActive && !isComplete && 'bg-muted text-muted-foreground'
              )}>
                {isComplete ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <div className="hidden lg:block flex-1 min-w-0">
                <p className={cn(
                  'text-sm leading-tight',
                  isActive && 'font-semibold',
                  isComplete && 'font-medium'
                )}>
                  {step.label}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {isComplete ? 'Complete' : isActive ? 'In progress' : 'Pending'}
                </p>
              </div>
              {idx < STEPS.length - 1 && (
                <div className="hidden lg:flex absolute left-[2.15rem] top-9 w-0.5 h-6 -translate-x-1/2">
                  <div className={cn(
                    'w-full h-full rounded-full transition-colors',
                    isComplete ? 'bg-green-400' : 'bg-muted-foreground/20'
                  )} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStepContent = (step: number) => {
    const animClass = animDir === 'right' ? 'animate-slide-up' : 'animate-fade-in';

    switch (step) {
      case 1:
        return (
          <div className={cn('space-y-5', animClass)}>
            <div>
              <h2 className="text-xl font-bold">Campaign Details</h2>
              <p className="text-sm text-muted-foreground">Define the basic information for your campaign</p>
            </div>

            <div className="space-y-2">
              <Label>Campaign Name</Label>
              <Input
                placeholder="e.g. Summer Promotion 2026"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe your campaign and what taskers need to know..."
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Platform</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    className="w-full h-10 pl-10 rounded-md border border-input bg-background text-sm appearance-none cursor-pointer"
                    value={form.platform}
                    onChange={(e) => handlePlatformChange(e.target.value)}
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Task Type</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={form.task_type}
                  onChange={(e) => update('task_type', e.target.value)}
                >
                  {platformTaskTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Task URL</Label>
              <div className="relative">
                <Input
                  type="url"
                  placeholder="https://example.com/post/123"
                  value={form.task_url}
                  onChange={(e) => update('task_url', e.target.value)}
                />
                {form.task_url && (
                  <a
                    href={form.task_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary hover:underline"
                  >
                    Preview
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Campaign Image / Media</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="media-upload"
                  onChange={(e) => update('media', e.target.files?.[0] || null)}
                />
                <label htmlFor="media-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-primary/60" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Drop your image here or <span className="text-primary">browse</span></p>
                    <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG, WebP up to 5MB</p>
                  </div>
                  {form.media && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                      <Check className="h-4 w-4" />
                      {form.media.name}
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Instructions for Workers</Label>
              <Textarea
                placeholder="Step-by-step instructions for completing this task..."
                value={form.instructions}
                onChange={(e) => update('instructions', e.target.value)}
                rows={4}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className={cn('space-y-5', animClass)}>
            <div>
              <h2 className="text-xl font-bold">Target Audience</h2>
              <p className="text-sm text-muted-foreground">Reach the right people for your campaign</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <MultiSelect
                label="Countries"
                options={COUNTRIES}
                selected={form.countries}
                onChange={(v) => { update('countries', v); update('states', []); update('cities', []); }}
              />
              <MultiSelect
                label="States/Regions"
                options={form.countries.flatMap((c) => STATES_BY_COUNTRY[c] || [])}
                selected={form.states}
                onChange={(v) => { update('states', v); update('cities', []); }}
                placeholder={form.countries.length === 0 ? 'Select a country first' : 'Select states...'}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <MultiSelect
                label="Cities"
                options={form.states.flatMap((s) => CITIES_BY_STATE[s] || [])}
                selected={form.cities}
                onChange={(v) => update('cities', v)}
                placeholder={form.states.length === 0 ? 'Select a state first' : 'Select cities...'}
              />
              <div className="space-y-1.5">
                <Label>Gender</Label>
                <div className="flex gap-2">
                  {['All', 'Male', 'Female', 'Other'].map((g) => (
                    <button
                      key={g}
                      onClick={() => update('genders', g)}
                      className={cn(
                        'flex-1 h-9 rounded-md text-sm font-medium transition-all border',
                        form.genders === g
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background text-muted-foreground border-input hover:border-primary/50'
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Min Age: {form.age_min}</Label>
                <input
                  type="range"
                  min="13"
                  max="100"
                  value={form.age_min}
                  onChange={(e) => update('age_min', parseInt(e.target.value))}
                  className="w-full accent-[#2D4F97]"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>13</span><span>100</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Max Age: {form.age_max}</Label>
                <input
                  type="range"
                  min="13"
                  max="100"
                  value={form.age_max}
                  onChange={(e) => update('age_max', parseInt(e.target.value))}
                  className="w-full accent-[#2D4F97]"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>13</span><span>100</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <MultiSelect
                label="Languages"
                options={LANGUAGES}
                selected={form.languages}
                onChange={(v) => update('languages', v)}
              />
              <div className="space-y-1.5">
                <Label>Device</Label>
                <div className="flex flex-wrap gap-1.5">
                  {DEVICES.map((d) => (
                    <button
                      key={d}
                      onClick={() => update('device', d)}
                      className={cn(
                        'px-3 h-8 rounded-md text-xs font-medium transition-all border',
                        form.device === d
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background text-muted-foreground border-input hover:border-primary/50'
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Operating System</Label>
                <div className="flex flex-wrap gap-1.5">
                  {OPERATING_SYSTEMS.map((o) => (
                    <button
                      key={o}
                      onClick={() => update('os', o)}
                      className={cn(
                        'px-3 h-8 rounded-md text-xs font-medium transition-all border',
                        form.os === o
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background text-muted-foreground border-input hover:border-primary/50'
                      )}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Minimum Reputation Level</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={form.reputation_level}
                  onChange={(e) => update('reputation_level', e.target.value)}
                >
                  {REPUTATION_LEVELS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <TagInput
              label="Interest / Keywords"
              tags={form.interests}
              onChange={(v) => update('interests', v)}
              placeholder="e.g. crypto, gaming, fitness..."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label className="text-sm font-medium">VIP Workers Only</Label>
                  <p className="text-xs text-muted-foreground">Only top-rated taskers</p>
                </div>
                <button
                  onClick={() => update('vip_only', !form.vip_only)}
                  className={cn(
                    'relative h-6 w-11 rounded-full transition-colors',
                    form.vip_only ? 'bg-[#18C79A]' : 'bg-muted'
                  )}
                >
                  <div className={cn(
                    'h-5 w-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform',
                    form.vip_only ? 'translate-x-[22px]' : 'translate-x-0.5'
                  )} />
                </button>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label className="text-sm font-medium">Verified Users Only</Label>
                  <p className="text-xs text-muted-foreground">Require account verification</p>
                </div>
                <button
                  onClick={() => update('verified_only', !form.verified_only)}
                  className={cn(
                    'relative h-6 w-11 rounded-full transition-colors',
                    form.verified_only ? 'bg-[#18C79A]' : 'bg-muted'
                  )}
                >
                  <div className={cn(
                    'h-5 w-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform',
                    form.verified_only ? 'translate-x-[22px]' : 'translate-x-0.5'
                  )} />
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className={cn('space-y-5', animClass)}>
            <div>
              <h2 className="text-xl font-bold">Task Settings</h2>
              <p className="text-sm text-muted-foreground">Configure how tasks are executed and rewarded</p>
            </div>

            <div className="space-y-2">
              <Label>Reward per Task (USDT)</Label>
              <Input
                type="number"
                step="0.001"
                min="0.001"
                value={form.reward_per_task}
                onChange={(e) => update('reward_per_task', parseFloat(e.target.value) || 0)}
              />
              <div className="flex gap-1.5 flex-wrap mt-1.5">
                {suggestedAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => update('reward_per_task', amt)}
                    className={cn(
                      'px-2.5 py-1 text-xs rounded-md border transition-all',
                      form.reward_per_task === amt
                        ? 'bg-primary/10 text-primary border-primary/30'
                        : 'bg-background text-muted-foreground border-input hover:border-primary/50'
                    )}
                  >
                    {amt} USDT
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Total Tasks</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.total_tasks}
                  onChange={(e) => update('total_tasks', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Daily Limit (0 = unlimited)</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.daily_limit}
                  onChange={(e) => update('daily_limit', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Task Instructions</Label>
              <Textarea
                placeholder="Detailed instructions for workers..."
                value={form.instructions}
                onChange={(e) => update('instructions', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Proof Type</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={form.proof_type}
                  onChange={(e) => update('proof_type', e.target.value)}
                >
                  {PROOF_TYPES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Time Limit per Task (minutes, optional)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Leave empty for no limit"
                  value={form.time_limit}
                  onChange={(e) => update('time_limit', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label className="text-sm font-medium">Auto Approval</Label>
                  <p className="text-xs text-muted-foreground">Automatically approve valid submissions</p>
                </div>
                <button
                  onClick={() => update('auto_approval', !form.auto_approval)}
                  className={cn(
                    'relative h-6 w-11 rounded-full transition-colors',
                    form.auto_approval ? 'bg-[#18C79A]' : 'bg-muted'
                  )}
                >
                  <div className={cn(
                    'h-5 w-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform',
                    form.auto_approval ? 'translate-x-[22px]' : 'translate-x-0.5'
                  )} />
                </button>
              </div>

              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Enable Multiple Submissions</Label>
                    <p className="text-xs text-muted-foreground">Allow users to submit more than once</p>
                  </div>
                  <button
                    onClick={() => update('multiple_submissions', !form.multiple_submissions)}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      form.multiple_submissions ? 'bg-[#18C79A]' : 'bg-muted'
                    )}
                  >
                    <div className={cn(
                      'h-5 w-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform',
                      form.multiple_submissions ? 'translate-x-[22px]' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>
                {form.multiple_submissions && (
                  <div className="mt-3 pt-3 border-t">
                    <Label className="text-xs">Max Submissions Per User</Label>
                    <Input
                      type="number"
                      min="1"
                      value={form.max_per_user}
                      onChange={(e) => update('max_per_user', parseInt(e.target.value) || 1)}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className={cn('space-y-5', animClass)}>
            <div>
              <h2 className="text-xl font-bold">Budget</h2>
              <p className="text-sm text-muted-foreground">Set your budget and schedule</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Total Budget (USDT)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.total_budget}
                  onChange={(e) => update('total_budget', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Daily Budget (optional)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="No limit"
                  value={form.daily_budget}
                  onChange={(e) => update('daily_budget', e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-lg border bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 p-4">
              <div className="flex items-center gap-2 text-sm font-medium mb-1">
                <Target className="h-4 w-4 text-primary" />
                Estimated Reach
              </div>
              <div className="text-2xl font-bold gradient-primary-text">
                {estimatedReach.toLocaleString()} tasks
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Based on {form.reward_per_task.toFixed(3)} USDT per task
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => update('start_date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => update('end_date', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ad Scheduling</Label>
              <div className="flex gap-2">
                <button
                  onClick={() => update('ad_schedule', 'all_day')}
                  className={cn(
                    'flex-1 h-9 rounded-md text-sm font-medium transition-all border',
                    form.ad_schedule === 'all_day'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-input'
                  )}
                >
                  All Day
                </button>
                <button
                  onClick={() => update('ad_schedule', 'custom')}
                  className={cn(
                    'flex-1 h-9 rounded-md text-sm font-medium transition-all border',
                    form.ad_schedule === 'custom'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-input'
                  )}
                >
                  Custom
                </button>
              </div>
              {form.ad_schedule === 'custom' && (
                <div className="flex gap-3 mt-2">
                  <div className="flex-1">
                    <Label className="text-xs">From</Label>
                    <Input type="time" value={form.ad_start_time} onChange={(e) => update('ad_start_time', e.target.value)} />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs">To</Label>
                    <Input type="time" value={form.ad_end_time} onChange={(e) => update('ad_end_time', e.target.value)} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Budget Allocation</Label>
                <span className="text-xs font-medium text-muted-foreground">
                  {form.budget_allocation <= 33 ? 'Spread Evenly' : form.budget_allocation <= 66 ? 'Front-Load' : 'Back-Load'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={form.budget_allocation}
                onChange={(e) => update('budget_allocation', parseInt(e.target.value))}
                className="w-full accent-[#2D4F97]"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Spread Evenly</span>
                <span>Front-Load</span>
                <span>Back-Load</span>
              </div>
            </div>

            <div className="rounded-lg border bg-secondary/5 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5 shrink-0" />
                Budget allocation determines how your budget is distributed across the campaign duration.
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className={cn('space-y-5', animClass)}>
            <div>
              <h2 className="text-xl font-bold">Verification & Anti-Cheat</h2>
              <p className="text-sm text-muted-foreground">Ensure quality and prevent fraud</p>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold">User Verification</Label>
              <div className="grid gap-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <Label className="text-sm font-medium">KYC Required</Label>
                    <p className="text-xs text-muted-foreground">Users must complete identity verification</p>
                  </div>
                  <button
                    onClick={() => update('kyc_required', !form.kyc_required)}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      form.kyc_required ? 'bg-[#18C79A]' : 'bg-muted'
                    )}
                  >
                    <div className={cn(
                      'h-5 w-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform',
                      form.kyc_required ? 'translate-x-[22px]' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <Label className="text-sm font-medium">Email Verification Required</Label>
                    <p className="text-xs text-muted-foreground">Users must verify their email address</p>
                  </div>
                  <button
                    onClick={() => update('email_verify', !form.email_verify)}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      form.email_verify ? 'bg-[#18C79A]' : 'bg-muted'
                    )}
                  >
                    <div className={cn(
                      'h-5 w-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform',
                      form.email_verify ? 'translate-x-[22px]' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <Label className="text-sm font-medium">Phone Verification Required</Label>
                    <p className="text-xs text-muted-foreground">Users must verify their phone number</p>
                  </div>
                  <button
                    onClick={() => update('phone_verify', !form.phone_verify)}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      form.phone_verify ? 'bg-[#18C79A]' : 'bg-muted'
                    )}
                  >
                    <div className={cn(
                      'h-5 w-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform',
                      form.phone_verify ? 'translate-x-[22px]' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Anti-Cheat Protection</Label>
              <div className="grid gap-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <Label className="text-sm font-medium">IP Uniqueness</Label>
                    <p className="text-xs text-muted-foreground">One IP per task submission</p>
                  </div>
                  <button
                    onClick={() => update('ip_uniqueness', !form.ip_uniqueness)}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      form.ip_uniqueness ? 'bg-[#18C79A]' : 'bg-muted'
                    )}
                  >
                    <div className={cn(
                      'h-5 w-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform',
                      form.ip_uniqueness ? 'translate-x-[22px]' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <Label className="text-sm font-medium">Device Uniqueness</Label>
                    <p className="text-xs text-muted-foreground">One device per task submission</p>
                  </div>
                  <button
                    onClick={() => update('device_uniqueness', !form.device_uniqueness)}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      form.device_uniqueness ? 'bg-[#18C79A]' : 'bg-muted'
                    )}
                  >
                    <div className={cn(
                      'h-5 w-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform',
                      form.device_uniqueness ? 'translate-x-[22px]' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <Label className="text-sm font-medium">Geo Match Required</Label>
                    <p className="text-xs text-muted-foreground">IP must match selected targeting</p>
                  </div>
                  <button
                    onClick={() => update('geo_match', !form.geo_match)}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      form.geo_match ? 'bg-[#18C79A]' : 'bg-muted'
                    )}
                  >
                    <div className={cn(
                      'h-5 w-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform',
                      form.geo_match ? 'translate-x-[22px]' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>

                <div className="space-y-1.5 rounded-lg border p-3">
                  <Label className="text-sm font-medium">Account Age Minimum</Label>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm mt-1"
                    value={form.account_age_min}
                    onChange={(e) => update('account_age_min', e.target.value)}
                  >
                    {ACCOUNT_AGE_MINIMUMS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Fraud Detection Level</Label>
              <div className="flex gap-2">
                {FRAUD_LEVELS.map((level) => (
                  <button
                    key={level}
                    onClick={() => update('fraud_level', level)}
                    className={cn(
                      'flex-1 h-10 rounded-md text-sm font-medium transition-all border',
                      form.fraud_level === level
                        ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                        : 'bg-background text-muted-foreground border-input hover:border-primary/50'
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {form.fraud_level === 'Low' && 'Minimal checks, faster task completion'}
                {form.fraud_level === 'Medium' && 'Standard fraud detection measures'}
                {form.fraud_level === 'High' && 'Enhanced verification and monitoring'}
                {form.fraud_level === 'Maximum' && 'Strictest security and fraud prevention'}
              </p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className={cn('space-y-5', animClass)}>
            <div>
              <h2 className="text-xl font-bold">Review & Publish</h2>
              <p className="text-sm text-muted-foreground">Review your campaign settings before publishing</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="glass-card-light">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Campaign Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{form.name || '—'}</span></div>
                  <div><span className="text-muted-foreground">Platform:</span> <span className="font-medium">{form.platform}</span></div>
                  <div><span className="text-muted-foreground">Task Type:</span> <span className="font-medium">{form.task_type}</span></div>
                  <div className="truncate"><span className="text-muted-foreground">URL:</span> <span className="font-medium">{form.task_url || '—'}</span></div>
                  {form.description && (
                    <div><span className="text-muted-foreground">Description:</span>
                      <p className="text-xs mt-0.5 line-clamp-2">{form.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-card-light">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Target className="h-4 w-4 text-secondary" />
                    Target Audience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><span className="text-muted-foreground">Countries:</span> <span className="font-medium">{form.countries.length > 0 ? form.countries.join(', ') : 'All'}</span></div>
                  <div><span className="text-muted-foreground">Gender:</span> <span className="font-medium">{form.genders}</span></div>
                  <div><span className="text-muted-foreground">Age Range:</span> <span className="font-medium">{form.age_min} - {form.age_max}</span></div>
                  <div><span className="text-muted-foreground">Languages:</span> <span className="font-medium">{form.languages.length > 0 ? form.languages.join(', ') : 'All'}</span></div>
                  <div><span className="text-muted-foreground">Device:</span> <span className="font-medium">{form.device}</span></div>
                  <div><span className="text-muted-foreground">OS:</span> <span className="font-medium">{form.os}</span></div>
                  {form.interests.length > 0 && (
                    <div><span className="text-muted-foreground">Keywords:</span> <span className="font-medium">{form.interests.join(', ')}</span></div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-card-light">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Settings className="h-4 w-4 text-accent" />
                    Task Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><span className="text-muted-foreground">Reward:</span> <span className="font-medium">{form.reward_per_task.toFixed(3)} USDT / task</span></div>
                  <div><span className="text-muted-foreground">Total Tasks:</span> <span className="font-medium">{form.total_tasks}</span></div>
                  <div><span className="text-muted-foreground">Daily Limit:</span> <span className="font-medium">{form.daily_limit > 0 ? form.daily_limit : 'Unlimited'}</span></div>
                  <div><span className="text-muted-foreground">Proof Type:</span> <span className="font-medium">{form.proof_type}</span></div>
                  <div><span className="text-muted-foreground">Auto Approval:</span> <span className="font-medium">{form.auto_approval ? 'Yes' : 'No'}</span></div>
                  {form.multiple_submissions && (
                    <div><span className="text-muted-foreground">Max Per User:</span> <span className="font-medium">{form.max_per_user}</span></div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-card-light">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><span className="text-muted-foreground">KYC:</span> <span className="font-medium">{form.kyc_required ? 'Yes' : 'No'}</span></div>
                  <div><span className="text-muted-foreground">Email Verify:</span> <span className="font-medium">{form.email_verify ? 'Yes' : 'No'}</span></div>
                  <div><span className="text-muted-foreground">Phone Verify:</span> <span className="font-medium">{form.phone_verify ? 'Yes' : 'No'}</span></div>
                  <div><span className="text-muted-foreground">Fraud Level:</span> <span className="font-medium">{form.fraud_level}</span></div>
                  <div><span className="text-muted-foreground">Account Age:</span> <span className="font-medium">{form.account_age_min}</span></div>
                  <div><span className="text-muted-foreground">IP/Device Uniqueness:</span> <span className="font-medium">{form.ip_uniqueness ? 'Yes' : 'No'} / {form.device_uniqueness ? 'Yes' : 'No'}</span></div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card-light border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Budget Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-primary/5 p-3">
                    <p className="text-xs text-muted-foreground">Total Budget</p>
                    <p className="text-2xl font-bold text-primary">{form.total_budget.toFixed(2)} USDT</p>
                  </div>
                  <div className="rounded-lg bg-accent/5 p-3">
                    <p className="text-xs text-muted-foreground">Estimated Reach</p>
                    <p className="text-2xl font-bold text-accent">{estimatedReach.toLocaleString()} tasks</p>
                  </div>
                  <div className="rounded-lg bg-secondary/5 p-3">
                    <p className="text-xs text-muted-foreground">Cost per Task</p>
                    <p className="text-2xl font-bold text-secondary">{form.reward_per_task.toFixed(3)} USDT</p>
                  </div>
                  <div className="rounded-lg bg-orange-50 p-3">
                    <p className="text-xs text-muted-foreground">Platform Fee (est.)</p>
                    <p className="text-2xl font-bold text-orange-600">{(form.total_budget * 0.05).toFixed(2)} USDT</p>
                    <p className="text-[10px] text-muted-foreground">5% service fee</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t flex justify-between items-center">
                  <span className="text-sm font-semibold">Total Cost</span>
                  <span className="text-lg font-bold gradient-primary-text">
                    {(form.total_budget * 1.05).toFixed(2)} USDT
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl space-y-6 mx-auto pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/advertiser/campaigns">
            <Button variant="outline" size="sm" className="rounded-xl">
              <ChevronLeft className="mr-1.5 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Create Campaign</h1>
            <p className="text-sm text-muted-foreground">Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1].label}</p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {renderProgress()}

        <div className="flex-1 min-w-0">
          <Card className="glass-card-light border-0 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              {renderStepContent(currentStep)}
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4 sm:p-6 pt-0 border-t mt-5">
              <div>
                {!isFirstStep ? (
                  <Button variant="outline" onClick={goPrev} className="rounded-xl">
                    <ChevronLeft className="mr-1.5 h-4 w-4" />
                    Previous
                  </Button>
                ) : (
                  <div />
                )}
              </div>
              <div className="flex items-center gap-2">
                {currentStep < 4 && (
                  <Button variant="ghost" size="sm" onClick={() => handleSubmit(true)} disabled={loading} className="text-muted-foreground">
                    <Save className="mr-1.5 h-4 w-4" />
                    Save Draft
                  </Button>
                )}
                {!isLastStep ? (
                  <Button onClick={goNext} className="rounded-xl gradient-primary border-0 text-white hover:opacity-90">
                    Continue
                    <ChevronRight className="ml-1.5 h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleSubmit(true)}
                      disabled={loading}
                      className="rounded-xl"
                    >
                      <Save className="mr-1.5 h-4 w-4" />
                      Save as Draft
                    </Button>
                    <Button
                      onClick={() => handleSubmit(false)}
                      disabled={loading}
                      className="rounded-xl gradient-primary border-0 text-white hover:opacity-90 min-w-[140px]"
                    >
                      {loading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Send className="mr-1.5 h-4 w-4" />
                          Publish Campaign
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
