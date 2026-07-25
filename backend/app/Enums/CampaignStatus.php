<?php

namespace App\Enums;

enum CampaignStatus: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
    case PAUSED = 'paused';
    case COMPLETED = 'completed';

    public function color(): string
    {
        return match($this) {
            self::PENDING => 'yellow',
            self::APPROVED => 'green',
            self::REJECTED => 'red',
            self::PAUSED => 'orange',
            self::COMPLETED => 'blue',
        };
    }
}
