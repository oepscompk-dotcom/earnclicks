<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Deposit;
use App\Models\Withdrawal;
use App\Services\WalletService;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class FinanceController extends Controller
{
    public function deposits(Request $request)
    {
        $query = Deposit::with('user');

        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        $deposits = $query->latest()->paginate($request->get('per_page', 20));

        return response()->json($deposits);
    }

    public function approveDeposit(Deposit $deposit)
    {
        $deposit->update(['status' => 'approved', 'confirmed_at' => now()]);

        $walletService = app(WalletService::class);
        $walletService->credit(
            $deposit->user,
            $deposit->amount,
            "Deposit confirmed ({$deposit->network})",
            'main',
            Deposit::class,
            $deposit->id
        );

        app(NotificationService::class)->depositSuccess($deposit->user, $deposit->amount);

        return response()->json(['message' => 'Deposit approved and balance credited']);
    }

    public function rejectDeposit(Request $request, Deposit $deposit)
    {
        $deposit->update([
            'status' => 'rejected',
            'admin_note' => $request->get('reason'),
        ]);

        return response()->json(['message' => 'Deposit rejected']);
    }

    public function withdrawals(Request $request)
    {
        $query = Withdrawal::with('user');

        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        $withdrawals = $query->latest()->paginate($request->get('per_page', 20));

        return response()->json($withdrawals);
    }

    public function approveWithdrawal(Withdrawal $withdrawal)
    {
        $withdrawal->update([
            'status' => 'completed',
            'processed_at' => now(),
        ]);

        app(NotificationService::class)->withdrawalApproved($withdrawal->user, $withdrawal->net_amount);

        return response()->json(['message' => 'Withdrawal approved']);
    }

    public function rejectWithdrawal(Request $request, Withdrawal $withdrawal)
    {
        $walletService = app(WalletService::class);
        $walletService->credit(
            $withdrawal->user,
            $withdrawal->amount,
            'Withdrawal rejected - refund'
        );

        $withdrawal->update([
            'status' => 'rejected',
            'admin_note' => $request->get('reason'),
        ]);

        return response()->json(['message' => 'Withdrawal rejected and balance refunded']);
    }
}
