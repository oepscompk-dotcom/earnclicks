<?php

namespace App\Enums;

enum TaskType: string
{
    case WATCH_VIDEO = 'watch_video';
    case LIKE = 'like';
    case FOLLOW = 'follow';
    case SUBSCRIBE = 'subscribe';
    case SHARE = 'share';
    case COMMENT = 'comment';
    case JOIN_GROUP = 'join_group';
    case VISIT_WEBSITE = 'visit_website';
    case INSTALL_APP = 'install_app';
    case TELEGRAM_JOIN = 'telegram_join';

    public function label(): string
    {
        return match($this) {
            self::WATCH_VIDEO => 'Watch Video',
            self::LIKE => 'Like',
            self::FOLLOW => 'Follow',
            self::SUBSCRIBE => 'Subscribe',
            self::SHARE => 'Share',
            self::COMMENT => 'Comment',
            self::JOIN_GROUP => 'Join Group',
            self::VISIT_WEBSITE => 'Visit Website',
            self::INSTALL_APP => 'Install App',
            self::TELEGRAM_JOIN => 'Join Telegram',
        };
    }
}
