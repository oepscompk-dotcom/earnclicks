<?php

namespace App\Services;

use App\Models\User;
use App\Models\Referral;
use App\Models\Setting;
use Illuminate\Support\Facades\DB;

class ReferralService
{
    public function processReferral(User $referrer, User $referred): Referral
    {
        return Referral::create([
            'referrer_id' => $referrer->id,
            'referred_id' => $referred->id,
            'level' => 1,
            'commission_earned' => 0,
        ]);
    }

    public function distributeCommission(User $earner, float $amount): void
    {
        $rates = [
            1 => (float) Setting::getValue('referral_level1_rate', 0.10),
            2 => (float) Setting::getValue('referral_level2_rate', 0.05),
            3 => (float) Setting::getValue('referral_level3_rate', 0.02),
        ];

        foreach ($rates as $level => $rate) {
            $referrer = $this->getReferrerAtLevel($earner, $level);
            if ($referrer && $rate > 0) {
                $commission = round($amount * $rate, 4);
                if ($commission > 0) {
                    $walletService = app(WalletService::class);
                    $walletService->credit(
                        $referrer,
                        $commission,
                        "Referral commission (Level {$level}) from {$earner->name}",
                        'referral'
                    );

                    Referral::where('referrer_id', $referrer->id)
                        ->where('referred_id', $earner->id)
                        ->where('level', $level)
                        ->increment('commission_earned', $commission);
                }
            }
        }
    }

    private function getReferrerAtLevel(User $user, int $level): ?User
    {
        $current = $user;
        for ($i = 1; $i < $level; $i++) {
            if (!$current->referred_by) return null;
            $current = User::find($current->referred_by);
            if (!$current) return null;
        }
        return $current->referred_by ? User::find($current->referred_by) : null;
    }

    public function getReferralStats(User $user): array
    {
        $totalReferrals = $user->referralsAsReferrer()->count();
        $totalCommission = $user->referralsAsReferrer()->sum('commission_earned');
        $directReferrals = $user->referralsAsReferrer()->where('level', 1)->count();

        return [
            'total_referrals' => $totalReferrals,
            'direct_referrals' => $directReferrals,
            'total_commission' => $totalCommission,
            'referral_link' => $user->referral_code,
        ];
    }
}
