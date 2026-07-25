<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReferralService;
use Illuminate\Http\Request;

class ReferralController extends Controller
{
    public function index(Request $request)
    {
        $referralService = app(ReferralService::class);
        $stats = $referralService->getReferralStats($request->user());

        $referrals = $request->user()->referralsAsReferrer()
            ->with('referred')
            ->latest()
            ->get();

        return response()->json([
            'stats' => $stats,
            'referrals' => $referrals,
        ]);
    }
}
