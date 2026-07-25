<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'country',
        'gender',
        'dob',
        'bio',
        'vip_level',
        'level',
        'xp_points',
    ];

    protected function casts(): array
    {
        return [
            'dob' => 'date',
            'vip_level' => 'integer',
            'xp_points' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
