<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use Illuminate\Http\Request;

class SupportController extends Controller
{
    public function index(Request $request)
    {
        $tickets = $request->user()->supportTickets()->latest()->get();
        return response()->json(['tickets' => $tickets]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
            'priority' => ['sometimes', 'in:low,medium,high,urgent'],
        ]);

        $ticket = $request->user()->supportTickets()->create($validated);

        return response()->json([
            'message' => 'Support ticket created',
            'ticket' => $ticket,
        ], 201);
    }

    public function show(Request $request, SupportTicket $ticket)
    {
        if ($ticket->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json(['ticket' => $ticket]);
    }
}
