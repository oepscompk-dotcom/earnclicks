<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CampaignService;
use App\Models\Campaign;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'platform' => ['required', 'string', 'in:facebook,youtube,tiktok,instagram,twitter,linkedin,website,telegram,discord,reddit,pinterest'],
            'task_type' => ['required', 'string', 'in:watch_video,like,follow,subscribe,share,comment,join_group,visit_website,install_app,telegram_join'],
            'task_url' => ['required', 'url', 'max:2000'],
            'reward_per_task' => ['required', 'numeric', 'min:0.001', 'max:100'],
            'total_budget' => ['required', 'numeric', 'min:1'],
            'daily_limit' => ['nullable', 'integer', 'min:1'],
            'countries' => ['nullable', 'array'],
            'gender' => ['nullable', 'in:male,female,all'],
            'age_min' => ['nullable', 'integer', 'min:13', 'max:100'],
            'age_max' => ['nullable', 'integer', 'min:13', 'max:100'],
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'instructions' => ['required', 'string', 'max:5000'],
        ]);

        $user = $request->user();
        $wallet = $user->wallets()->where('type', 'main')->first();

        if (!$wallet || $wallet->balance < $validated['total_budget']) {
            return response()->json(['message' => 'Insufficient balance. Please deposit funds first.'], 400);
        }

        $campaignService = app(CampaignService::class);
        $campaign = $campaignService->createCampaign($user, $validated);

        return response()->json([
            'message' => 'Campaign created successfully. Pending admin approval.',
            'campaign' => $campaign,
        ], 201);
    }

    public function index(Request $request)
    {
        $campaignService = app(CampaignService::class);
        $campaigns = $campaignService->getAdvertiserCampaigns(
            $request->user(),
            $request->get('status')
        );

        return response()->json(['campaigns' => $campaigns]);
    }

    public function show(Request $request, Campaign $campaign)
    {
        if ($campaign->advertiser_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $campaign->load(['tasks', 'submissions.user', 'submissions.task']);

        return response()->json(['campaign' => $campaign]);
    }
}
