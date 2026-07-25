<?php

namespace App\Enums;

enum Platform: string
{
    case FACEBOOK = 'facebook';
    case YOUTUBE = 'youtube';
    case TIKTOK = 'tiktok';
    case INSTAGRAM = 'instagram';
    case TWITTER = 'twitter';
    case LINKEDIN = 'linkedin';
    case WEBSITE = 'website';
    case TELEGRAM = 'telegram';
    case DISCORD = 'discord';
    case REDDIT = 'reddit';
    case PINTEREST = 'pinterest';

    public function label(): string
    {
        return match($this) {
            self::FACEBOOK => 'Facebook',
            self::YOUTUBE => 'YouTube',
            self::TIKTOK => 'TikTok',
            self::INSTAGRAM => 'Instagram',
            self::TWITTER => 'X (Twitter)',
            self::LINKEDIN => 'LinkedIn',
            self::WEBSITE => 'Website',
            self::TELEGRAM => 'Telegram',
            self::DISCORD => 'Discord',
            self::REDDIT => 'Reddit',
            self::PINTEREST => 'Pinterest',
        };
    }

    public function icon(): string
    {
        return match($this) {
            self::FACEBOOK => 'facebook',
            self::YOUTUBE => 'youtube',
            self::TIKTOK => 'tiktok',
            self::INSTAGRAM => 'instagram',
            self::TWITTER => 'twitter',
            self::LINKEDIN => 'linkedin',
            self::WEBSITE => 'globe',
            self::TELEGRAM => 'send',
            self::DISCORD => 'message-circle',
            self::REDDIT => 'message-square',
            self::PINTEREST => 'pin',
        };
    }
}
