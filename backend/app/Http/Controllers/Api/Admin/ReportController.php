<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Campaign;
use App\Models\TaskSubmission;
use App\Models\Deposit;
use App\Models\Withdrawal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->get('period', 'daily');
        $startDate = $request->get('start_date', now()->subDays(30));
        $endDate = $request->get('end_date', now());

        $revenue = DB::table('wallet_transactions')
            ->where('type', 'debit')
            ->where('description', 'like', '%Campaign%')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, SUM(amount) as total')
            ->groupBy('date')
            ->get();

        $topAdvertisers = User::where('role', 'advertiser')
            ->withSum('campaigns', 'spent')
            ->orderByDesc('campaigns_sum_spent')
            ->limit(10)
            ->get();

        $topWorkers = User::where('role', 'user')
            ->withSum('submissions', 'reward_amount')
            ->where('submissions.status', 'approved')
            ->orderByDesc('submissions_sum_reward_amount')
            ->limit(10)
            ->get();

        return response()->json([
            'revenue' => $revenue,
            'top_advertisers' => $topAdvertisers,
            'top_workers' => $topWorkers,
        ]);
    }
}
