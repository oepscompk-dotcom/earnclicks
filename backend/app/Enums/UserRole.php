<?php

namespace App\Enums;

enum UserRole: string
{
    case USER = 'user';
    case ADVERTISER = 'advertiser';
    case ADMIN = 'admin';

    public function label(): string
    {
        return match($this) {
            self::USER => 'Tasker',
            self::ADVERTISER => 'Advertiser',
            self::ADMIN => 'Administrator',
        };
    }
}
