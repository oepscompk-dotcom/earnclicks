<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TaskSubmissionController;
use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\WalletController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ReferralController;
use App\Http\Controllers\Api\SupportController;
use App\Http\Controllers\Api\KycController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\CampaignManagementController;
use App\Http\Controllers\Api\Admin\TaskManagementController;
use App\Http\Controllers\Api\Admin\FinanceController;
use App\Http\Controllers\Api\Admin\KycManagementController;
use App\Http\Controllers\Api\Admin\SettingController;
use App\Http\Controllers\Api\Admin\ReportController;
use App\Http\Controllers\Api\Admin\CmsController;

// Public routes
Route::post('/auth/register', [RegisterController::class, 'register']);
Route::post('/auth/login', [LoginController::class, 'login']);
Route::get('/public/logos', [CmsController::class, 'getLogos']);

// Serve logo files with correct Content-Type
Route::get('/public/logos/{filename}', function ($filename) {
    $path = storage_path('app/public/logos/' . $filename);
    if (!file_exists($path)) {
        return response()->json(['message' => 'Logo not found'], 404)
            ->header('Cache-Control', 'no-store, no-cache, must-revalidate');
    }
    $extension = pathinfo($filename, PATHINFO_EXTENSION);
    $mimeTypes = [
        'svg' => 'image/svg+xml',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'ico' => 'image/x-icon',
        'webp' => 'image/webp',
    ];
    $mime = $mimeTypes[strtolower($extension)] ?? 'application/octet-stream';
    return response()->file($path, [
        'Content-Type' => $mime,
        'Cache-Control' => 'no-cache, must-revalidate',
    ]);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [LoginController::class, 'logout']);
    Route::get('/auth/me', [LoginController::class, 'me']);
    Route::put('/auth/profile', [LoginController::class, 'updateProfile']);
    Route::put('/auth/password', [LoginController::class, 'changePassword']);

    // Tasks
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::get('/tasks/{task}', [TaskController::class, 'show']);
    Route::post('/tasks/submit', [TaskSubmissionController::class, 'store']);
    Route::get('/my-submissions', [TaskSubmissionController::class, 'mySubmissions']);

    // Campaigns (Advertiser)
    Route::post('/campaigns', [CampaignController::class, 'store']);
    Route::get('/campaigns', [CampaignController::class, 'index']);
    Route::get('/campaigns/{campaign}', [CampaignController::class, 'show']);

    // Wallet
    Route::get('/wallet', [WalletController::class, 'index']);
    Route::get('/wallet/transactions', [WalletController::class, 'transactions']);
    Route::post('/wallet/deposit', [WalletController::class, 'deposit']);
    Route::get('/wallet/withdrawals', [WalletController::class, 'withdrawals']);
    Route::post('/wallet/withdraw', [WalletController::class, 'requestWithdrawal']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    // Referrals
    Route::get('/referrals', [ReferralController::class, 'index']);

    // Support
    Route::get('/support', [SupportController::class, 'index']);
    Route::post('/support', [SupportController::class, 'store']);
    Route::get('/support/{ticket}', [SupportController::class, 'show']);

    // KYC
    Route::get('/kyc', [KycController::class, 'index']);
    Route::post('/kyc', [KycController::class, 'store']);

    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);

        // Users
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::put('/users/{user}/status', [UserController::class, 'updateStatus']);
        Route::post('/users/{user}/suspend', [UserController::class, 'suspend']);
        Route::post('/users/{user}/ban', [UserController::class, 'ban']);
        Route::post('/users/{user}/verify', [UserController::class, 'verify']);

        // Campaigns
        Route::get('/campaigns', [CampaignManagementController::class, 'index']);
        Route::get('/campaigns/{campaign}', [CampaignManagementController::class, 'show']);
        Route::post('/campaigns/{campaign}/approve', [CampaignManagementController::class, 'approve']);
        Route::post('/campaigns/{campaign}/reject', [CampaignManagementController::class, 'reject']);
        Route::post('/campaigns/{campaign}/pause', [CampaignManagementController::class, 'pause']);

        // Tasks
        Route::get('/submissions', [TaskManagementController::class, 'index']);
        Route::post('/submissions/{submission}/approve', [TaskManagementController::class, 'approve']);
        Route::post('/submissions/{submission}/reject', [TaskManagementController::class, 'reject']);

        // Finance
        Route::get('/deposits', [FinanceController::class, 'deposits']);
        Route::post('/deposits/{deposit}/approve', [FinanceController::class, 'approveDeposit']);
        Route::post('/deposits/{deposit}/reject', [FinanceController::class, 'rejectDeposit']);
        Route::get('/withdrawals', [FinanceController::class, 'withdrawals']);
        Route::post('/withdrawals/{withdrawal}/approve', [FinanceController::class, 'approveWithdrawal']);
        Route::post('/withdrawals/{withdrawal}/reject', [FinanceController::class, 'rejectWithdrawal']);

        // KYC
        Route::get('/kyc', [KycManagementController::class, 'index']);
        Route::post('/kyc/{kyc}/approve', [KycManagementController::class, 'approve']);
        Route::post('/kyc/{kyc}/reject', [KycManagementController::class, 'reject']);

        // Settings
        Route::get('/settings', [SettingController::class, 'index']);
        Route::put('/settings', [SettingController::class, 'update']);

        // CMS - Logos & Branding
        Route::get('/cms/logos', [CmsController::class, 'getLogos']);
        Route::post('/cms/logos/upload', [CmsController::class, 'uploadLogo']);
        Route::post('/cms/logos/remove', [CmsController::class, 'removeLogo']);
        Route::put('/cms/site-name', [CmsController::class, 'updateSiteName']);
        Route::get('/cms/settings', [CmsController::class, 'getAllSettings']);
        Route::post('/cms/settings', [CmsController::class, 'saveSettings']);

        // Reports
        Route::get('/reports', [ReportController::class, 'index']);
    });
});
