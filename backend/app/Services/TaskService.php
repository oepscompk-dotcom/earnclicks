<?php

namespace App\Services;

use App\Models\Campaign;
use App\Models\Task;
use App\Models\TaskSubmission;
use App\Models\User;
use App\Services\ReferralService;
use App\Services\NotificationService;
use Illuminate\Support\Facades\DB;

class TaskService
{
    public function getAvailableTasks(User $user, ?string $platform = null, int $limit = 20): \Illuminate\Support\Collection
    {
        $query = Task::where('status', 'active')
            ->whereHas('campaign', function ($q) use ($user) {
                $q->where('status', 'approved')
                  ->where('start_date', '<=', now())
                  ->where('end_date', '>=', now())
                  ->whereColumn('completed_tasks', '<', 'total_tasks');
            })
            ->whereDoesntHave('submissions', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });

        if ($platform) {
            $query->where('platform', $platform);
        }

        return $query->with(['campaign.advertiser', 'campaign'])
            ->orderByDesc('reward')
            ->limit($limit)
            ->get();
    }

    public function submitTask(User $user, Task $task, string $proofUrl, string $proofType): TaskSubmission
    {
        return DB::transaction(function () use ($user, $task, $proofUrl, $proofType) {
            $submission = TaskSubmission::create([
                'task_id' => $task->id,
                'user_id' => $user->id,
                'campaign_id' => $task->campaign_id,
                'proof_url' => $proofUrl,
                'proof_type' => $proofType,
                'status' => 'pending',
                'ip_address' => request()->ip(),
                'device_info' => request()->userAgent(),
                'reward_amount' => $task->reward,
            ]);

            $task->increment('current_submissions');
            $task->campaign->increment('completed_tasks');

            return $submission;
        });
    }

    public function getUserSubmissions(User $user, ?string $status = null, int $limit = 50): \Illuminate\Database\Eloquent\Collection
    {
        $query = $user->submissions()->with(['task', 'campaign']);

        if ($status) {
            $query->where('status', $status);
        }

        return $query->latest()->limit($limit)->get();
    }

    public function approveSubmission(TaskSubmission $submission): bool
    {
        return DB::transaction(function () use ($submission) {
            $submission->update([
                'status' => 'approved',
                'verified_at' => now(),
            ]);

            $walletService = app(WalletService::class);
            $walletService->credit(
                $submission->user,
                $submission->reward_amount,
                "Task completed: {$submission->task->title}",
                'main',
                TaskSubmission::class,
                $submission->id
            );

            $submission->campaign->increment('spent', $submission->reward_amount);

            $notificationService = app(NotificationService::class);
            $notificationService->rewardReceived($submission->user, $submission->reward_amount);

            $referralService = app(ReferralService::class);
            $referralService->distributeCommission($submission->user, $submission->reward_amount);

            return true;
        });
    }

    public function rejectSubmission(TaskSubmission $submission, ?string $reason = null): bool
    {
        $submission->update([
            'status' => 'rejected',
            'admin_note' => $reason,
        ]);

        $submission->task->decrement('current_submissions');
        $submission->campaign->decrement('completed_tasks');

        return true;
    }
}
