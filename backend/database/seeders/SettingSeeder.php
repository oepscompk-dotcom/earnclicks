<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'reward_watch_video', 'value' => '0.02', 'group' => 'rewards', 'type' => 'number'],
            ['key' => 'reward_like', 'value' => '0.01', 'group' => 'rewards', 'type' => 'number'],
            ['key' => 'reward_follow', 'value' => '0.03', 'group' => 'rewards', 'type' => 'number'],
            ['key' => 'reward_subscribe', 'value' => '0.03', 'group' => 'rewards', 'type' => 'number'],
            ['key' => 'reward_share', 'value' => '0.02', 'group' => 'rewards', 'type' => 'number'],
            ['key' => 'reward_comment', 'value' => '0.04', 'group' => 'rewards', 'type' => 'number'],
            ['key' => 'reward_join_group', 'value' => '0.02', 'group' => 'rewards', 'type' => 'number'],
            ['key' => 'reward_visit_website', 'value' => '0.01', 'group' => 'rewards', 'type' => 'number'],
            ['key' => 'reward_install_app', 'value' => '0.05', 'group' => 'rewards', 'type' => 'number'],
            ['key' => 'reward_telegram_join', 'value' => '0.02', 'group' => 'rewards', 'type' => 'number'],

            ['key' => 'min_withdrawal', 'value' => '10', 'group' => 'finance', 'type' => 'number'],
            ['key' => 'withdrawal_fee_percent', 'value' => '2', 'group' => 'finance', 'type' => 'number'],
            ['key' => 'platform_fee_percent', 'value' => '5', 'group' => 'finance', 'type' => 'number'],
            ['key' => 'min_deposit', 'value' => '1', 'group' => 'finance', 'type' => 'number'],

            ['key' => 'referral_level1_percent', 'value' => '10', 'group' => 'referral', 'type' => 'number'],
            ['key' => 'referral_level2_percent', 'value' => '5', 'group' => 'referral', 'type' => 'number'],
            ['key' => 'referral_level3_percent', 'value' => '2', 'group' => 'referral', 'type' => 'number'],

            ['key' => 'daily_bonus_amount', 'value' => '0.01', 'group' => 'bonus', 'type' => 'number'],
            ['key' => 'registration_bonus', 'value' => '0.1', 'group' => 'bonus', 'type' => 'number'],

            ['key' => 'platform_name', 'value' => 'EarnClicks', 'group' => 'general', 'type' => 'text'],
            ['key' => 'platform_tagline', 'value' => 'Complete Social Media Tasks. Earn USDT. Promote Your Content Worldwide.', 'group' => 'general', 'type' => 'text'],
            ['key' => 'support_email', 'value' => 'support@earnclicks.app', 'group' => 'general', 'type' => 'text'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
