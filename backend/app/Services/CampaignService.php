<?php

namespace App\Services;

use App\Models\Campaign;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CampaignService
{
    public function createCampaign(User $advertiser, array $data): Campaign
    {
        return DB::transaction(function () use ($advertiser, $data) {
            $campaign = Campaign::create([
                'advertiser_id' => $advertiser->id,
                'name' => $data['name'],
                'platform' => $data['platform'],
                'task_type' => $data['task_type'],
                'task_url' => $data['task_url'],
                'reward_per_task' => $data['reward_per_task'],
                'total_budget' => $data['total_budget'],
                'daily_limit' => $data['daily_limit'] ?? null,
                'total_tasks' => ceil($data['total_budget'] / $data['reward_per_task']),
                'status' => 'pending',
                'countries' => $data['countries'] ?? null,
                'gender' => $data['gender'] ?? 'all',
                'age_min' => $data['age_min'] ?? null,
                'age_max' => $data['age_max'] ?? null,
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
                'instructions' => $data['instructions'],
            ]);

            Task::create([
                'campaign_id' => $campaign->id,
                'title' => $data['name'],
                'description' => $data['instructions'],
                'platform' => $data['platform'],
                'task_type' => $data['task_type'],
                'reward' => $data['reward_per_task'],
                'status' => 'active',
                'max_submissions' => $campaign->total_tasks,
            ]);

            $walletService = app(WalletService::class);
            $walletService->debit($advertiser, $data['total_budget'], "Campaign: {$data['name']}", 'main', Campaign::class, $campaign->id);

            return $campaign;
        });
    }

    public function approveCampaign(Campaign $campaign): bool
    {
        $campaign->update(['status' => 'approved']);
        return true;
    }

    public function rejectCampaign(Campaign $campaign, ?string $reason = null): bool
    {
        return DB::transaction(function () use ($campaign, $reason) {
            $campaign->update(['status' => 'rejected']);

            $walletService = app(WalletService::class);
            $walletService->credit(
                $campaign->advertiser,
                $campaign->total_budget,
                "Refund for rejected campaign: {$campaign->name}",
                'main',
                Campaign::class,
                $campaign->id
            );

            return true;
        });
    }

    public function pauseCampaign(Campaign $campaign): bool
    {
        $campaign->update(['status' => 'paused']);
        return true;
    }

    public function getAdvertiserCampaigns(User $advertiser, ?string $status = null): \Illuminate\Database\Eloquent\Collection
    {
        $query = $campaigns = $advertiser->campaigns();

        if ($status) {
            $query->where('status', $status);
        }

        return $query->withCount(['tasks', 'submissions'])
            ->latest()
            ->get();
    }
}
