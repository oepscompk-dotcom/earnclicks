<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    public function send(User $user, string $type, string $title, string $message, ?array $data = null): Notification
    {
        return Notification::create([
            'user_id' => $user->id,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => $data,
        ]);
    }

    public function markAsRead(Notification $notification): bool
    {
        return $notification->markAsRead();
    }

    public function markAllAsRead(User $user): bool
    {
        $user->notifications()->whereNull('read_at')->update(['read_at' => now()]);
        return true;
    }

    public function getUnreadCount(User $user): int
    {
        return $user->notifications()->whereNull('read_at')->count();
    }

    public function getNotifications(User $user, int $limit = 50): \Illuminate\Database\Eloquent\Collection
    {
        return $user->notifications()->latest()->limit($limit)->get();
    }

    public function newTask(User $user, string $taskName): Notification
    {
        return $this->send($user, 'new_task', 'New Task Available', "A new task \"{$taskName}\" is now available.");
    }

    public function rewardReceived(User $user, float $amount): Notification
    {
        return $this->send($user, 'reward_received', 'Reward Received', "You received {$amount} USDT for completing a task.");
    }

    public function depositSuccess(User $user, float $amount): Notification
    {
        return $this->send($user, 'deposit_success', 'Deposit Successful', "Your deposit of {$amount} USDT has been confirmed.");
    }

    public function withdrawalApproved(User $user, float $amount): Notification
    {
        return $this->send($user, 'withdrawal_approved', 'Withdrawal Approved', "Your withdrawal of {$amount} USDT has been approved.");
    }

    public function campaignApproved(User $advertiser, string $campaignName): Notification
    {
        return $this->send($advertiser, 'campaign_approved', 'Campaign Approved', "Your campaign \"{$campaignName}\" has been approved and is now live.");
    }

    public function campaignRejected(User $advertiser, string $campaignName): Notification
    {
        return $this->send($advertiser, 'campaign_rejected', 'Campaign Rejected', "Your campaign \"{$campaignName}\" has been rejected.");
    }
}
