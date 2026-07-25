<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kyc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class KycController extends Controller
{
    public function index(Request $request)
    {
        $kyc = $request->user()->kyc;
        return response()->json(['kyc' => $kyc]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'document_type' => ['required', 'in:passport,national_id,drivers_license'],
            'document_front' => ['required', 'file', 'mimes:jpg,jpeg,png', 'max:5120'],
            'document_back' => ['nullable', 'file', 'mimes:jpg,jpeg,png', 'max:5120'],
            'selfie' => ['required', 'file', 'mimes:jpg,jpeg,png', 'max:5120'],
        ]);

        $frontPath = $request->file('document_front')->store('kyc', 'public');
        $backPath = $validated['document_back']
            ? $request->file('document_back')->store('kyc', 'public')
            : null;
        $selfiePath = $request->file('selfie')->store('kyc', 'public');

        $kyc = Kyc::updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'document_type' => $validated['document_type'],
                'document_front_url' => $frontPath,
                'document_back_url' => $backPath,
                'selfie_url' => $selfiePath,
                'status' => 'pending',
            ]
        );

        return response()->json([
            'message' => 'KYC documents submitted for review',
            'kyc' => $kyc,
        ], 201);
    }
}
