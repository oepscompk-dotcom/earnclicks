<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\TaskSubmission;
use App\Services\TaskService;
use Illuminate\Http\Request;

class TaskManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = TaskSubmission::with(['user', 'task', 'campaign']);

        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        $submissions = $query->latest()->paginate($request->get('per_page', 20));

        return response()->json($submissions);
    }

    public function approve(TaskSubmission $submission)
    {
        $taskService = app(TaskService::class);
        $taskService->approveSubmission($submission);

        return response()->json(['message' => 'Submission approved and reward released']);
    }

    public function reject(Request $request, TaskSubmission $submission)
    {
        $taskService = app(TaskService::class);
        $taskService->rejectSubmission($submission, $request->get('reason'));

        return response()->json(['message' => 'Submission rejected']);
    }
}
