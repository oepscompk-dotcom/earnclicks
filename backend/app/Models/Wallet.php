<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Wallet extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'balance',
        'frozen_balance',
        'currency',
    ];

    protected function casts(): array
    {
        return [
            'balance' => 'float',
            'frozen_balance' => 'float',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(WalletTransaction::class);
    }

    public function addBalance(float $amount): bool
    {
        $this->balance += $amount;
        return $this->save();
    }

    public function subtractBalance(float $amount): bool
    {
        if ($this->balance < $amount) {
            return false;
        }
        $this->balance -= $amount;
        return $this->save();
    }

    public function freezeBalance(float $amount): bool
    {
        if ($this->balance < $amount) {
            return false;
        }
        $this->balance -= $amount;
        $this->frozen_balance += $amount;
        return $this->save();
    }

    public function unfreezeBalance(float $amount): bool
    {
        if ($this->frozen_balance < $amount) {
            return false;
        }
        $this->frozen_balance -= $amount;
        $this->balance += $amount;
        return $this->save();
    }

    public function getAvailableBalanceAttribute(): float
    {
        return $this->balance - $this->frozen_balance;
    }
}
