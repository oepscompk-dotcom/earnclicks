export const neonSchema = `
CREATE TABLE IF NOT EXISTS users (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "role" TEXT DEFAULT 'user',
  "status" TEXT DEFAULT 'active',
  "avatar" TEXT,
  "phone" TEXT,
  "referral_code" TEXT UNIQUE NOT NULL,
  "referred_by" INTEGER REFERENCES users("id"),
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER UNIQUE NOT NULL REFERENCES users("id"),
  "country" TEXT,
  "state" TEXT,
  "city" TEXT,
  "gender" TEXT,
  "dob" TEXT,
  "language" TEXT,
  "timezone" TEXT,
  "wallet_currency" TEXT DEFAULT 'USDT',
  "network" TEXT DEFAULT 'TRC20',
  "bio" TEXT,
  "level" TEXT DEFAULT 'bronze',
  "xp_points" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS wallets (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES users("id"),
  "type" TEXT DEFAULT 'main',
  "balance" DOUBLE PRECISION DEFAULT 0,
  "frozen_balance" DOUBLE PRECISION DEFAULT 0,
  "currency" TEXT DEFAULT 'USDT'
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  "id" SERIAL PRIMARY KEY,
  "wallet_id" INTEGER NOT NULL REFERENCES wallets("id"),
  "type" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "balance_after" DOUBLE PRECISION NOT NULL,
  "description" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS campaigns (
  "id" SERIAL PRIMARY KEY,
  "advertiser_id" INTEGER NOT NULL REFERENCES users("id"),
  "name" TEXT NOT NULL,
  "platform" TEXT NOT NULL,
  "task_type" TEXT NOT NULL,
  "task_url" TEXT NOT NULL,
  "reward_per_task" DOUBLE PRECISION NOT NULL,
  "total_budget" DOUBLE PRECISION NOT NULL,
  "spent" DOUBLE PRECISION DEFAULT 0,
  "daily_limit" INTEGER,
  "total_tasks" INTEGER NOT NULL,
  "completed_tasks" INTEGER DEFAULT 0,
  "status" TEXT DEFAULT 'pending',
  "instructions" TEXT,
  "start_date" TIMESTAMP,
  "end_date" TIMESTAMP,
  "is_featured" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
  "id" SERIAL PRIMARY KEY,
  "campaign_id" INTEGER NOT NULL REFERENCES campaigns("id"),
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "platform" TEXT NOT NULL,
  "task_type" TEXT NOT NULL,
  "reward" DOUBLE PRECISION NOT NULL,
  "status" TEXT DEFAULT 'active',
  "max_submissions" INTEGER NOT NULL,
  "current_submissions" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS task_submissions (
  "id" SERIAL PRIMARY KEY,
  "task_id" INTEGER NOT NULL REFERENCES tasks("id"),
  "user_id" INTEGER NOT NULL REFERENCES users("id"),
  "campaign_id" INTEGER NOT NULL,
  "proof_url" TEXT NOT NULL,
  "proof_type" TEXT NOT NULL,
  "status" TEXT DEFAULT 'pending',
  "reward_amount" DOUBLE PRECISION NOT NULL,
  "ip_address" TEXT,
  "device_info" TEXT,
  "admin_note" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS deposits (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES users("id"),
  "amount" DOUBLE PRECISION NOT NULL,
  "currency" TEXT DEFAULT 'USDT',
  "network" TEXT NOT NULL,
  "tx_hash" TEXT NOT NULL,
  "wallet_address" TEXT NOT NULL,
  "status" TEXT DEFAULT 'pending',
  "admin_note" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS withdrawals (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES users("id"),
  "amount" DOUBLE PRECISION NOT NULL,
  "currency" TEXT DEFAULT 'USDT',
  "network" TEXT NOT NULL,
  "wallet_address" TEXT NOT NULL,
  "fee" DOUBLE PRECISION DEFAULT 0,
  "net_amount" DOUBLE PRECISION NOT NULL,
  "status" TEXT DEFAULT 'pending',
  "tx_hash" TEXT,
  "admin_note" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES users("id"),
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "data" TEXT,
  "read_at" TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  "id" SERIAL PRIMARY KEY,
  "key" TEXT UNIQUE NOT NULL,
  "value" TEXT NOT NULL,
  "group_name" TEXT DEFAULT 'general',
  "type" TEXT DEFAULT 'text'
);

CREATE TABLE IF NOT EXISTS kyc (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER UNIQUE NOT NULL REFERENCES users("id"),
  "document_type" TEXT NOT NULL,
  "document_front_url" TEXT NOT NULL,
  "document_back_url" TEXT,
  "selfie_url" TEXT NOT NULL,
  "status" TEXT DEFAULT 'pending',
  "admin_note" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS support_tickets (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES users("id"),
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "priority" TEXT DEFAULT 'medium',
  "status" TEXT DEFAULT 'open',
  "admin_id" INTEGER REFERENCES users("id"),
  "reply" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS referrals (
  "id" SERIAL PRIMARY KEY,
  "referrer_id" INTEGER NOT NULL REFERENCES users("id"),
  "referred_id" INTEGER NOT NULL REFERENCES users("id"),
  "level" INTEGER DEFAULT 1,
  "commission_earned" DOUBLE PRECISION DEFAULT 0,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER REFERENCES users("id"),
  "action" TEXT NOT NULL,
  "description" TEXT,
  "ip_address" TEXT,
  "user_agent" TEXT,
  "properties" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;