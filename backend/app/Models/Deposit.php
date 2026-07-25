<?php

namespace App\Models;

use App\Enums\TransactionStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Deposit extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'amount',
        'currency',
        'network',
        'tx_hash',
        'wallet_address',
        'status',
        'admin_note',
        'confirmed_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'float',
            'confirmed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isPending(): bool
    {
        return $this->status === TransactionStatus::PENDING;
    }

    public function isApproved(): bool
    {
        return $this->status === TransactionStatus::APPROVED;
    }
}
