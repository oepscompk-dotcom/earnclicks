<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['user', 'advertiser', 'admin'])->default('user');
            $table->enum('status', ['active', 'suspended', 'banned'])->default('active');
            $table->string('avatar')->nullable();
            $table->string('phone')->nullable();
            $table->string('two_factor_secret')->nullable();
            $table->boolean('two_factor_enabled')->default(false);
            $table->string('referral_code')->unique();
            $table->foreignId('referred_by')->nullable()->constrained('users');
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('country')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->date('dob')->nullable();
            $table->text('bio')->nullable();
            $table->integer('vip_level')->default(0);
            $table->enum('level', ['bronze', 'silver', 'gold', 'diamond', 'platinum', 'elite', 'legend'])->default('bronze');
            $table->integer('xp_points')->default(0);
            $table->timestamps();
        });

        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['main', 'referral', 'bonus', 'pending']);
            $table->decimal('balance', 12, 4)->default(0);
            $table->decimal('frozen_balance', 12, 4)->default(0);
            $table->string('currency', 10)->default('USDT');
            $table->timestamps();
        });

        Schema::create('wallet_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wallet_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['credit', 'debit']);
            $table->decimal('amount', 12, 4);
            $table->decimal('balance_after', 12, 4);
            $table->string('description');
            $table->string('reference_type')->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->timestamps();
        });

        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('advertiser_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('platform');
            $table->string('task_type');
            $table->string('task_url');
            $table->decimal('reward_per_task', 12, 4);
            $table->decimal('total_budget', 12, 4);
            $table->decimal('spent', 12, 4)->default(0);
            $table->integer('daily_limit')->nullable();
            $table->integer('total_tasks');
            $table->integer('completed_tasks')->default(0);
            $table->enum('status', ['pending', 'approved', 'rejected', 'paused', 'completed'])->default('pending');
            $table->json('countries')->nullable();
            $table->enum('gender', ['male', 'female', 'all'])->default('all');
            $table->integer('age_min')->nullable();
            $table->integer('age_max')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->text('instructions');
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->string('platform');
            $table->string('task_type');
            $table->decimal('reward', 12, 4);
            $table->enum('status', ['active', 'inactive', 'completed'])->default('active');
            $table->integer('max_submissions');
            $table->integer('current_submissions')->default(0);
            $table->timestamps();
        });

        Schema::create('task_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->text('proof_url');
            $table->enum('proof_type', ['screenshot', 'video', 'text', 'link']);
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('admin_note')->nullable();
            $table->string('ip_address', 45);
            $table->text('device_info');
            $table->timestamp('verified_at')->nullable();
            $table->decimal('reward_amount', 12, 4);
            $table->timestamps();
        });

        Schema::create('deposits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 12, 4);
            $table->string('currency', 10)->default('USDT');
            $table->enum('network', ['trc20', 'bep20', 'erc20']);
            $table->string('tx_hash');
            $table->string('wallet_address');
            $table->enum('status', ['pending', 'approved', 'rejected', 'completed'])->default('pending');
            $table->text('admin_note')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('withdrawals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 12, 4);
            $table->string('currency', 10)->default('USDT');
            $table->enum('network', ['trc20', 'bep20', 'erc20']);
            $table->string('wallet_address');
            $table->decimal('fee', 12, 4)->default(0);
            $table->decimal('net_amount', 12, 4);
            $table->enum('status', ['pending', 'approved', 'rejected', 'completed'])->default('pending');
            $table->string('tx_hash')->nullable();
            $table->text('admin_note')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('referrals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('referrer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('referred_id')->constrained('users')->cascadeOnDelete();
            $table->tinyInteger('level');
            $table->decimal('commission_earned', 12, 4)->default(0);
            $table->timestamps();
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->string('title');
            $table->text('message');
            $table->json('data')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value');
            $table->string('group')->default('general');
            $table->string('type')->default('text');
            $table->timestamps();
        });

        Schema::create('kyc', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('document_type', ['passport', 'national_id', 'drivers_license']);
            $table->string('document_front_url');
            $table->string('document_back_url')->nullable();
            $table->string('selfie_url');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('admin_note')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
        });

        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('subject');
            $table->text('message');
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->enum('status', ['open', 'answered', 'closed'])->default('open');
            $table->foreignId('admin_id')->nullable()->constrained('users');
            $table->text('reply')->nullable();
            $table->timestamps();
        });

        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action');
            $table->text('description')->nullable();
            $table->string('ip_address', 45);
            $table->text('user_agent');
            $table->json('properties')->nullable();
            $table->timestamps();
        });

        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('support_tickets');
        Schema::dropIfExists('kyc');
        Schema::dropIfExists('settings');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('referrals');
        Schema::dropIfExists('withdrawals');
        Schema::dropIfExists('deposits');
        Schema::dropIfExists('task_submissions');
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('campaigns');
        Schema::dropIfExists('wallet_transactions');
        Schema::dropIfExists('wallets');
        Schema::dropIfExists('profiles');
        Schema::dropIfExists('users');
    }
};
