<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kyc;
use Illuminate\Http\Request;

class KycManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = Kyc::with('user');

        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        $kyCs = $query->latest()->paginate($request->get('per_page', 20));

        return response()->json($kyCs);
    }

    public function approve(Kyc $kyc)
    {
        $kyc->update(['status' => 'approved', 'verified_at' => now()]);
        return response()->json(['message' => 'KYC approved']);
    }

    public function reject(Request $request, Kyc $kyc)
    {
        $kyc->update([
            'status' => 'rejected',
            'admin_note' => $request->get('reason'),
        ]);
        return response()->json(['message' => 'KYC rejected']);
    }
}
