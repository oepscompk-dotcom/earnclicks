<?php

namespace App\Services;

use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class WalletService
{
    public function getOrCreateWallet(User $user, string $type = 'main'): Wallet
    {
        return Wallet::firstOrCreate(
            ['user_id' => $user->id, 'type' => $type],
            ['balance' => 0, 'frozen_balance' => 0, 'currency' => 'USDT']
        );
    }

    public function credit(User $user, float $amount, string $description, string $type = 'main', ?string $referenceType = null, ?int $referenceId = null): WalletTransaction
    {
        return DB::transaction(function () use ($user, $amount, $description, $type, $referenceType, $referenceId) {
            $wallet = $this->getOrCreateWallet($user, $type);
            $wallet->balance += $amount;
            $wallet->save();

            return WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'type' => 'credit',
                'amount' => $amount,
                'balance_after' => $wallet->balance,
                'description' => $description,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
            ]);
        });
    }

    public function debit(User $user, float $amount, string $description, string $type = 'main', ?string $referenceType = null, ?int $referenceId = null): ?WalletTransaction
    {
        return DB::transaction(function () use ($user, $amount, $description, $type, $referenceType, $referenceId) {
            $wallet = $this->getOrCreateWallet($user, $type);

            if ($wallet->balance < $amount) {
                return null;
            }

            $wallet->balance -= $amount;
            $wallet->save();

            return WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'type' => 'debit',
                'amount' => $amount,
                'balance_after' => $wallet->balance,
                'description' => $description,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
            ]);
        });
    }

    public function getBalance(User $user, string $type = 'main'): float
    {
        $wallet = $this->getOrCreateWallet($user, $type);
        return $wallet->balance;
    }

    public function getTransactions(User $user, string $type = 'main', int $limit = 50): \Illuminate\Database\Eloquent\Collection
    {
        $wallet = $this->getOrCreateWallet($user, $type);
        return $wallet->transactions()->latest()->limit($limit)->get();
    }

    public function getTotalBalance(User $user): array
    {
        $wallets = $user->wallets;
        $total = 0;
        $breakdown = [];

        foreach ($wallets as $wallet) {
            $breakdown[$wallet->type] = $wallet->balance;
            $total += $wallet->balance;
        }

        return [
            'total' => $total,
            'breakdown' => $breakdown,
        ];
    }
}
