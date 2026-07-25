<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Profile;
use App\Services\WalletService;
use App\Services\ReferralService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['sometimes', 'in:user,advertiser'],
            'referral_code' => ['sometimes', 'string', 'exists:users,referral_code'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'] ?? 'user',
            'status' => 'active',
            'referral_code' => strtoupper(Str::random(8)),
            'referred_by' => isset($validated['referral_code'])
                ? User::where('referral_code', $validated['referral_code'])->first()?->id
                : null,
        ]);

        Profile::create(['user_id' => $user->id]);

        $walletService = app(WalletService::class);
        $walletService->getOrCreateWallet($user, 'main');
        $walletService->getOrCreateWallet($user, 'referral');
        $walletService->getOrCreateWallet($user, 'bonus');

        if ($user->referred_by) {
            $referrer = User::find($user->referred_by);
            app(ReferralService::class)->processReferral($referrer, $user);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        $user->load('profile', 'wallets');

        return response()->json([
            'message' => 'Registration successful',
            'user' => $user,
            'token' => $token,
        ], 201);
    }
}
