export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'advertiser' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  avatar: string | null;
  phone: string | null;
  two_factor_enabled: boolean;
  referral_code: string;
  referred_by: number | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  wallets?: Wallet[];
}

export interface Profile {
  id: number;
  user_id: number;
  country: string | null;
  gender: 'male' | 'female' | 'other' | null;
  dob: string | null;
  bio: string | null;
  phone: string | null;
  company: string | null;
  website: string | null;
  city: string | null;
  vip_level: number;
  level: 'bronze' | 'silver' | 'gold' | 'diamond' | 'platinum' | 'elite' | 'legend';
  xp_points: number;
}

export interface Wallet {
  id: number;
  user_id: number;
  type: 'main' | 'referral' | 'bonus' | 'pending';
  balance: number;
  frozen_balance: number;
  currency: string;
}

export interface WalletTransaction {
  id: number;
  wallet_id: number;
  type: 'credit' | 'debit';
  amount: number;
  balance_after: number;
  description: string;
  reference_type: string | null;
  reference_id: number | null;
  created_at: string;
}

export interface Campaign {
  id: number;
  advertiser_id: number;
  name: string;
  platform: Platform;
  task_type: TaskType;
  task_url: string;
  reward_per_task: number;
  total_budget: number;
  spent: number;
  daily_limit: number | null;
  total_tasks: number;
  completed_tasks: number;
  status: CampaignStatus;
  countries: string[] | null;
  gender: 'male' | 'female' | 'all' | null;
  age_min: number | null;
  age_max: number | null;
  start_date: string;
  end_date: string;
  instructions: string;
  is_featured: boolean;
  created_at: string;
  advertiser?: User;
  tasks?: Task[];
  submissions?: TaskSubmission[];
  tasks_count?: number;
  submissions_count?: number;
}

export interface Task {
  id: number;
  campaign_id: number;
  title: string;
  description: string;
  platform: Platform;
  task_type: TaskType;
  reward: number;
  status: 'active' | 'inactive' | 'completed';
  max_submissions: number;
  current_submissions: number;
  campaign?: Campaign;
}

export interface TaskSubmission {
  id: number;
  task_id: number;
  user_id: number;
  campaign_id: number;
  proof_url: string;
  proof_type: 'screenshot' | 'video' | 'text' | 'link';
  status: SubmissionStatus;
  admin_note: string | null;
  ip_address: string;
  device_info: string;
  verified_at: string | null;
  reward_amount: number;
  created_at: string;
  task?: Task;
  user?: User;
  campaign?: Campaign;
}

export interface Deposit {
  id: number;
  user_id: number;
  amount: number;
  currency: string;
  network: 'trc20' | 'bep20' | 'erc20';
  tx_hash: string;
  wallet_address: string;
  status: TransactionStatus;
  admin_note: string | null;
  confirmed_at: string | null;
  created_at: string;
}

export interface Withdrawal {
  id: number;
  user_id: number;
  amount: number;
  currency: string;
  network: 'trc20' | 'bep20' | 'erc20';
  wallet_address: string;
  fee: number;
  net_amount: number;
  status: TransactionStatus;
  tx_hash: string | null;
  admin_note: string | null;
  processed_at: string | null;
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  data: any;
  read_at: string | null;
  created_at: string;
}

export interface Referral {
  id: number;
  referrer_id: number;
  referred_id: number;
  level: number;
  commission_earned: number;
  referred?: User;
  created_at: string;
}

export interface SupportTicket {
  id: number;
  user_id: number;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'answered' | 'closed';
  admin_id: number | null;
  reply: string | null;
  created_at: string;
}

export interface Kyc {
  id: number;
  user_id: number;
  document_type: 'passport' | 'national_id' | 'drivers_license';
  document_front_url: string;
  document_back_url: string | null;
  selfie_url: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_note: string | null;
  verified_at: string | null;
  created_at: string;
}

export type Platform = 'facebook' | 'youtube' | 'tiktok' | 'instagram' | 'twitter' | 'linkedin' | 'website' | 'telegram' | 'discord' | 'reddit' | 'pinterest';

export type TaskType = 'watch_video' | 'like' | 'follow' | 'subscribe' | 'share' | 'comment' | 'join_group' | 'visit_website' | 'install_app' | 'telegram_join';

export type CampaignStatus = 'pending' | 'approved' | 'rejected' | 'paused' | 'completed';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export type TransactionStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export type UserRole = 'user' | 'advertiser' | 'admin';

export interface DashboardStats {
  total_earnings: number;
  today_earnings: number;
  tasks_completed: number;
  pending_tasks: number;
  level: string;
  xp_points: number;
}

export interface AdvertiserDashboardStats {
  wallet_balance: number;
  active_campaigns: number;
  total_views: number;
  completed_tasks: number;
  total_spent: number;
}

export interface AdminDashboardStats {
  total_users: number;
  total_advertisers: number;
  total_campaigns: number;
  pending_campaigns: number;
  active_campaigns: number;
  total_submissions: number;
  pending_submissions: number;
  total_deposits: number;
  total_withdrawals: number;
  pending_deposits: number;
  pending_withdrawals: number;
}
