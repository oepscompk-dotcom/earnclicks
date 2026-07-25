# EarnClicks

**Complete Social Media Tasks. Earn USDT. Promote Your Content Worldwide.**

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Laravel 12, PHP 8.4, Sanctum
- **Database:** MySQL 8, Redis
- **Queue:** Redis Queue (Laravel Horizon)
- **Deployment:** Vercel (frontend) + Railway (backend)

## Quick Start

### Prerequisites

- PHP 8.4+
- Node.js 18+
- MySQL 8
- Redis

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-repo/earnclicks.git
cd earnclicks
```

2. Start Docker services (MySQL + Redis)
```bash
docker-compose up -d
```

3. Setup Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

4. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@earnclicks.app | password |
| Advertiser | advertiser@earnclicks.app | password |
| Tasker | tasker@earnclicks.app | password |

## API Documentation

The API is available at `http://localhost:8000/api`

### Public Routes

- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login

### Protected Routes (requires Bearer token)

- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `GET /api/tasks` - Get available tasks
- `POST /api/tasks/submit` - Submit task
- `GET /api/wallet` - Get wallet balance
- `POST /api/wallet/deposit` - Request deposit
- `POST /api/wallet/withdraw` - Request withdrawal
- `GET /api/campaigns` - Get campaigns (advertiser)
- `POST /api/campaigns` - Create campaign (advertiser)

### Admin Routes (requires admin role)

- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/{id}/status` - Update user status
- `GET /api/admin/campaigns` - List campaigns
- `POST /api/admin/campaigns/{id}/approve` - Approve campaign
- `GET /api/admin/deposits` - List deposits
- `POST /api/admin/deposits/{id}/approve` - Approve deposit
- `GET /api/admin/withdrawals` - List withdrawals

## Features

### For Taskers
- Browse available tasks across multiple platforms
- Complete tasks and earn USDT
- Track earnings and withdrawal history
- Referral program (3-level)
- Level progression system

### For Advertisers
- Create and manage campaigns
- Target by country, age, gender
- Real-time analytics
- Budget control

### For Admins
- Full platform management
- User/Advertiser management
- Campaign approval
- Financial oversight
- Reports and analytics

## License

Proprietary
