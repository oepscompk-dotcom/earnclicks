import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';

let db: any = null;
const DB_PATH = path.join(process.cwd(), 'data.db');

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'active',
  avatar TEXT,
  phone TEXT,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  country TEXT,
  state TEXT,
  city TEXT,
  gender TEXT,
  dob TEXT,
  language TEXT,
  timezone TEXT,
  wallet_currency TEXT DEFAULT 'USDT',
  network TEXT DEFAULT 'TRC20',
  bio TEXT,
  level TEXT DEFAULT 'bronze',
  xp_points INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS wallets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT DEFAULT 'main',
  balance REAL DEFAULT 0,
  frozen_balance REAL DEFAULT 0,
  currency TEXT DEFAULT 'USDT',
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wallet_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  amount REAL NOT NULL,
  balance_after REAL NOT NULL,
  description TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (wallet_id) REFERENCES wallets(id)
);

CREATE TABLE IF NOT EXISTS campaigns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  advertiser_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  platform TEXT NOT NULL,
  task_type TEXT NOT NULL,
  task_url TEXT NOT NULL,
  reward_per_task REAL NOT NULL,
  total_budget REAL NOT NULL,
  spent REAL DEFAULT 0,
  daily_limit INTEGER,
  total_tasks INTEGER NOT NULL,
  completed_tasks INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  instructions TEXT,
  start_date TEXT,
  end_date TEXT,
  is_featured INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (advertiser_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  campaign_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  platform TEXT NOT NULL,
  task_type TEXT NOT NULL,
  reward REAL NOT NULL,
  status TEXT DEFAULT 'active',
  max_submissions INTEGER NOT NULL,
  current_submissions INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);

CREATE TABLE IF NOT EXISTS task_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  campaign_id INTEGER NOT NULL,
  proof_url TEXT NOT NULL,
  proof_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  reward_amount REAL NOT NULL,
  ip_address TEXT,
  device_info TEXT,
  admin_note TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS deposits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'USDT',
  network TEXT NOT NULL,
  tx_hash TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  admin_note TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS withdrawals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'USDT',
  network TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  fee REAL DEFAULT 0,
  net_amount REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  tx_hash TEXT,
  admin_note TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data TEXT,
  read_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  group_name TEXT DEFAULT 'general',
  type TEXT DEFAULT 'text'
);

CREATE TABLE IF NOT EXISTS kyc (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  document_type TEXT NOT NULL,
  document_front_url TEXT NOT NULL,
  document_back_url TEXT,
  selfie_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  admin_note TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  admin_id INTEGER,
  reply TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS referrals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  referrer_id INTEGER NOT NULL,
  referred_id INTEGER NOT NULL,
  level INTEGER DEFAULT 1,
  commission_earned REAL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (referrer_id) REFERENCES users(id),
  FOREIGN KEY (referred_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  description TEXT,
  ip_address TEXT,
  user_agent TEXT,
  properties TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
`;

export function getDb(): any {
  return db;
}

export async function initDatabase(): Promise<any> {
  if (IS_NEON()) {
    if (neonClient) return neonClient;
    const { neon } = await import('@neondatabase/serverless');
    neonClient = neon(process.env.DATABASE_URL!);
    const { neonSchema } = await import('./neon-schema');
    try { await neonClient(neonSchema); } catch {}
    try {
      await neonClient(`INSERT INTO settings (key, value, group_name) VALUES ('site_name', 'EarnClicks', 'general') ON CONFLICT (key) DO NOTHING`);
      await neonClient(`INSERT INTO settings (key, value, group_name) VALUES ('site_tagline', 'Earn Crypto by Completing Social Media Tasks', 'general') ON CONFLICT (key) DO NOTHING`);
    } catch {}
    return neonClient;
  }

  if (db) return db;
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  db.run(SCHEMA);
  db.run(`INSERT OR IGNORE INTO settings (key, value, group_name) VALUES ('site_name', 'EarnClicks', 'general')`);
  db.run(`INSERT OR IGNORE INTO settings (key, value, group_name) VALUES ('site_tagline', 'Earn Crypto by Completing Social Media Tasks', 'general')`);
  saveDb();
  return db;
}

export function saveDb(): void {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  } catch {}
}

export function closeDb(): void {
  if (db) {
    saveDb();
    db.close();
    db = null;
  }
}

// ─── Unified query/execute (auto-detects Neon vs sql.js) ───

let neonClient: any = null;
const IS_NEON = () => !!process.env.DATABASE_URL;

function convertParams(sql: string, params?: any[]): { text: string; args?: any[] } {
  if (!params || params.length === 0) return { text: sql };
  let idx = 0;
  const text = sql.replace(/\?/g, () => `$${++idx}`);
  return { text, args: params };
}

export async function query(sql: string, params?: any[]): Promise<any[]> {
  if (IS_NEON()) {
    if (!neonClient) {
      const { neon } = await import('@neondatabase/serverless');
      neonClient = neon(process.env.DATABASE_URL!);
    }
    const { text, args } = convertParams(sql, params);
    return await neonClient(text, ...(args || []));
  }
  if (!db) await initDatabase();
  if (params && params.length > 0) {
    const escaped = params.map((p: any) => (typeof p === 'string' ? `'${p.replace(/'/g, "''")}'` : p));
    let i = 0;
    const filled = sql.replace(/\?/g, () => String(escaped[i++]));
    const result = db.exec(filled);
    if (result.length && result[0].values.length) {
      const cols = result[0].columns;
      return result[0].values.map((row: any[]) => {
        const obj: any = {};
        cols.forEach((c: string, j: number) => { obj[c] = row[j]; });
        return obj;
      });
    }
    return [];
  }
  const result = db.exec(sql);
  if (result.length && result[0].values.length) {
    const cols = result[0].columns;
    return result[0].values.map((row: any[]) => {
      const obj: any = {};
      cols.forEach((c: string, j: number) => { obj[c] = row[j]; });
      return obj;
    });
  }
  return [];
}

export async function execute(sql: string, params?: any[]): Promise<{ rowCount: number; rows?: any[] }> {
  if (IS_NEON()) {
    if (!neonClient) {
      const { neon } = await import('@neondatabase/serverless');
      neonClient = neon(process.env.DATABASE_URL!);
    }
    const { text, args } = convertParams(sql, params);
    const result = await neonClient(text, ...(args || []));
    return { rowCount: result?.length || 0, rows: result };
  }
  if (!db) await initDatabase();
  if (params && params.length > 0) {
    const escaped = params.map((p: any) => (typeof p === 'string' ? `'${p.replace(/'/g, "''")}'` : p));
    let i = 0;
    const filled = sql.replace(/\?/g, () => String(escaped[i++]));
    db.run(filled);
  } else {
    db.run(sql);
  }
  saveDb();
  return { rowCount: 1 };
}


