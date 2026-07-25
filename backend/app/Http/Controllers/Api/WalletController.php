<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\WalletService;
use App\Models\Deposit;
use App\Models\Setting;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function index(Request $request)
    {
        $walletService = app(WalletService::class);
        $balance = $walletService->getTotalBalance($request->user());

        return response()->json($balance);
    }

    public function transactions(Request $request)
    {
        $walletService = app(WalletService::class);
        $transactions = $walletService->getTransactions(
            $request->user(),
            $request->get('type', 'main'),
            $request->get('limit', 50)
        );

        return response()->json(['transactions' => $transactions]);
    }

    public function deposit(Request $request)
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1', 'max:100000'],
            'network' => ['required', 'in:trc20,bep20,erc20'],
            'tx_hash' => ['required', 'string', 'max:255'],
            'wallet_address' => ['required', 'string', 'max:255'],
        ]);

        $deposit = Deposit::create([
            'user_id' => $request->user()->id,
            'amount' => $validated['amount'],
            'currency' => 'USDT',
            'network' => $validated['network'],
            'tx_hash' => $validated['tx_hash'],
            'wallet_address' => $validated['wallet_address'],
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Deposit request submitted. Awaiting confirmation.',
            'deposit' => $deposit,
        ], 201);
    }

    public function withdrawals(Request $request)
    {
        $withdrawals = $request->user()->withdrawals()->latest()->limit(50)->get();
        return response()->json(['withdrawals' => $withdrawals]);
    }

    public function requestWithdrawal(Request $request)
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:10'],
            'network' => ['required', 'in:trc20,bep20,erc20'],
            'wallet_address' => ['required', 'string', 'max:255'],
        ]);

        $user = $request->user();
        $walletService = app(WalletService::class);
        $balance = $walletService->getBalance($user, 'main');

        $feeRate = (float) Setting::getValue('withdrawal_fee', 0.02);
        $fee = $validated['amount'] * $feeRate;
        $netAmount = $validated['amount'] - $fee;

        if ($balance < $validated['amount']) {
            return response()->json(['message' => 'Insufficient balance'], 400);
        }

        $walletService->debit($user, $validated['amount'], 'Withdrawal request');

        $withdrawal = $user->withdrawals()->create([
            'amount' => $validated['amount'],
            'currency' => 'USDT',
            'network' => $validated['network'],
            'wallet_address' => $validated['wallet_address'],
            'fee' => $fee,
            'net_amount' => $netAmount,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Withdrawal request submitted',
            'withdrawal' => $withdrawal,
        ], 201);
    }
}
