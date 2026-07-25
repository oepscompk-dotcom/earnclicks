<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Campaign;
use App\Models\TaskSubmission;
use App\Models\Deposit;
use App\Models\Withdrawal;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::where('role', 'user')->count(),
            'total_advertisers' => User::where('role', 'advertiser')->count(),
            'total_campaigns' => Campaign::count(),
            'pending_campaigns' => Campaign::where('status', 'pending')->count(),
            'active_campaigns' => Campaign::where('status', 'approved')->count(),
            'total_submissions' => TaskSubmission::count(),
            'pending_submissions' => TaskSubmission::where('status', 'pending')->count(),
            'total_deposits' => Deposit::sum('amount'),
            'total_withdrawals' => Withdrawal::sum('amount'),
            'pending_deposits' => Deposit::where('status', 'pending')->count(),
            'pending_withdrawals' => Withdrawal::where('status', 'pending')->count(),
        ];

        $recentActivity = [
            'recent_users' => User::latest()->limit(10)->get(),
            'recent_campaigns' => Campaign::with('advertiser')->latest()->limit(10)->get(),
            'recent_submissions' => TaskSubmission::with(['user', 'task'])->latest()->limit(10)->get(),
        ];

        return response()->json([
            'stats' => $stats,
            'activity' => $recentActivity,
        ]);
    }
}
