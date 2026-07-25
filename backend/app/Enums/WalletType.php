<?php

namespace App\Enums;

enum WalletType: string
{
    case MAIN = 'main';
    case REFERRAL = 'referral';
    case BONUS = 'bonus';
    case PENDING = 'pending';
}
