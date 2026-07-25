<?php

namespace App\Enums;

enum UserLevel: string
{
    case BRONZE = 'bronze';
    case SILVER = 'silver';
    case GOLD = 'gold';
    case DIAMOND = 'diamond';
    case PLATINUM = 'platinum';
    case ELITE = 'elite';
    case LEGEND = 'legend';

    public function xpRequired(): int
    {
        return match($this) {
            self::BRONZE => 0,
            self::SILVER => 500,
            self::GOLD => 2000,
            self::DIAMOND => 5000,
            self::PLATINUM => 15000,
            self::ELITE => 50000,
            self::LEGEND => 150000,
        };
    }

    public function label(): string
    {
        return ucfirst($this->value);
    }
}
