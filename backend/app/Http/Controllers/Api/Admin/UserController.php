<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('profile');

        if ($request->has('role')) {
            $query->where('role', $request->get('role'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate($request->get('per_page', 20));

        return response()->json($users);
    }

    public function show(User $user)
    {
        $user->load(['profile', 'wallets', 'submissions', 'deposits', 'withdrawals']);
        return response()->json(['user' => $user]);
    }

    public function updateStatus(Request $request, User $user)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:active,suspended,banned'],
        ]);

        $user->update(['status' => $validated['status']]);

        return response()->json([
            'message' => "User status updated to {$validated['status']}",
            'user' => $user,
        ]);
    }

    public function suspend(User $user)
    {
        $user->update(['status' => 'suspended']);
        return response()->json(['message' => 'User suspended']);
    }

    public function ban(User $user)
    {
        $user->update(['status' => 'banned']);
        return response()->json(['message' => 'User banned']);
    }

    public function verify(User $user)
    {
        $user->update(['email_verified_at' => now()]);
        return response()->json(['message' => 'User verified']);
    }
}
