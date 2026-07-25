<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TaskService;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskSubmissionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'task_id' => ['required', 'exists:tasks,id'],
            'proof_url' => ['required', 'string', 'max:2000'],
            'proof_type' => ['required', 'in:screenshot,video,text,link'],
        ]);

        $task = Task::findOrFail($validated['task_id']);

        if (!$task->isAvailable()) {
            return response()->json(['message' => 'Task is no longer available'], 400);
        }

        $existingSubmission = $request->user()->submissions()
            ->where('task_id', $task->id)
            ->exists();

        if ($existingSubmission) {
            return response()->json(['message' => 'You have already submitted this task'], 400);
        }

        $taskService = app(TaskService::class);
        $submission = $taskService->submitTask(
            $request->user(),
            $task,
            $validated['proof_url'],
            $validated['proof_type']
        );

        return response()->json([
            'message' => 'Task submitted successfully',
            'submission' => $submission->load(['task', 'campaign']),
        ], 201);
    }

    public function mySubmissions(Request $request)
    {
        $taskService = app(TaskService::class);
        $submissions = $taskService->getUserSubmissions(
            $request->user(),
            $request->get('status'),
            $request->get('limit', 50)
        );

        return response()->json(['submissions' => $submissions]);
    }
}
