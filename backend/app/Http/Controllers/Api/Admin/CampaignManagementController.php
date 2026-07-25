<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Services\CampaignService;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class CampaignManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = Campaign::with('advertiser');

        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        $campaigns = $query->latest()->paginate($request->get('per_page', 20));

        return response()->json($campaigns);
    }

    public function show(Campaign $campaign)
    {
        $campaign->load(['advertiser', 'tasks', 'submissions.user']);
        return response()->json(['campaign' => $campaign]);
    }

    public function approve(Campaign $campaign)
    {
        $campaignService = app(CampaignService::class);
        $campaignService->approveCampaign($campaign);

        app(NotificationService::class)->campaignApproved($campaign->advertiser, $campaign->name);

        return response()->json(['message' => 'Campaign approved']);
    }

    public function reject(Request $request, Campaign $campaign)
    {
        $campaignService = app(CampaignService::class);
        $campaignService->rejectCampaign($campaign, $request->get('reason'));

        app(NotificationService::class)->campaignRejected($campaign->advertiser, $campaign->name);

        return response()->json(['message' => 'Campaign rejected and budget refunded']);
    }

    public function pause(Campaign $campaign)
    {
        $campaign->update(['status' => 'paused']);
        return response()->json(['message' => 'Campaign paused']);
    }
}
