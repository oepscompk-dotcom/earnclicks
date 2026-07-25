<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TaskService;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $taskService = app(TaskService::class);
        $tasks = $taskService->getAvailableTasks(
            $request->user(),
            $request->get('platform'),
            $request->get('limit', 20)
        );

        return response()->json(['tasks' => $tasks]);
    }

    public function show(Task $task)
    {
        $task->load(['campaign.advertiser', 'campaign']);
        return response()->json(['task' => $task]);
    }
}
