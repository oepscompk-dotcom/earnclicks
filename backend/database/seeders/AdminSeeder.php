<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Profile;
use App\Models\Wallet;
use App\Services\WalletService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@earnclicks.app'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'active',
                'referral_code' => 'ADMIN001',
                'email_verified_at' => now(),
            ]
        );

        Profile::updateOrCreate(
            ['user_id' => $admin->id],
            ['country' => 'US', 'level' => 'legend', 'vip_level' => 4]
        );

        $walletService = app(WalletService::class);
        $walletService->getOrCreateWallet($admin, 'main');

        $advertiser = User::updateOrCreate(
            ['email' => 'advertiser@earnclicks.app'],
            [
                'name' => 'Demo Advertiser',
                'password' => Hash::make('password'),
                'role' => 'advertiser',
                'status' => 'active',
                'referral_code' => 'ADV001',
                'email_verified_at' => now(),
            ]
        );

        Profile::updateOrCreate(
            ['user_id' => $advertiser->id],
            ['country' => 'US', 'level' => 'gold', 'vip_level' => 2]
        );

        $walletService->getOrCreateWallet($advertiser, 'main');
        $walletService->credit($advertiser, 100, 'Demo deposit', 'main');

        $tasker = User::updateOrCreate(
            ['email' => 'tasker@earnclicks.app'],
            [
                'name' => 'Demo Tasker',
                'password' => Hash::make('password'),
                'role' => 'user',
                'status' => 'active',
                'referral_code' => 'TSK001',
                'email_verified_at' => now(),
            ]
        );

        Profile::updateOrCreate(
            ['user_id' => $tasker->id],
            ['country' => 'US', 'level' => 'silver', 'vip_level' => 1]
        );

        $walletService->getOrCreateWallet($tasker, 'main');
        $walletService->getOrCreateWallet($tasker, 'referral');
        $walletService->getOrCreateWallet($tasker, 'bonus');
    }
}
