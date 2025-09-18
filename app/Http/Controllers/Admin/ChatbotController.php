<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatbotConversation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatbotController extends Controller
{
    /**
     * Display chatbot dashboard with conversations
     */
    public function index(Request $request)
    {
        $query = ChatbotConversation::with('user')
            ->orderBy('created_at', 'desc');

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by session
        if ($request->filled('session_id')) {
            $query->where('session_id', $request->session_id);
        }

        // Filter by feedback
        if ($request->filled('feedback')) {
            if ($request->feedback === 'positive') {
                $query->where('feedback_rating', '>=', 4);
            } elseif ($request->feedback === 'negative') {
                $query->where('feedback_rating', '<=', 2);
            }
        }

        $conversations = $query->paginate(20)->withQueryString();

        // Get statistics
        $stats = [
            'total_conversations' => ChatbotConversation::count(),
            'today_conversations' => ChatbotConversation::whereDate('created_at', today())->count(),
            'avg_confidence' => ChatbotConversation::avg('confidence_score'),
            'positive_feedback' => ChatbotConversation::where('is_helpful', true)->count()
        ];

        return Inertia::render('Admin/Chatbot', [
            'conversations' => $conversations,
            'stats' => $stats,
            'filters' => $request->only(['user_id', 'session_id', 'feedback'])
        ]);
    }

    /**
     * Show the form for creating a new chatbot conversation
     */
    public function create()
    {
        return Inertia::render('Admin/Chatbot/Create');
    }

    /**
     * Show chatbot interface
     */
    public function chat()
    {
        return Inertia::render('Admin/Chatbot/Chat');
    }

    /**
     * Process chatbot message
     */
    public function processMessage(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
            'session_id' => 'nullable|string',
            'context' => 'nullable|array'
        ]);
        
        $sessionId = $validated['session_id'] ?? uniqid('chat_');
        $userMessage = $validated['message'];
        $context = $validated['context'] ?? [];
        
        // Process message and generate response first
        $response = $this->generateChatbotResponse($userMessage, $context);

        // Store complete conversation (user message + bot response)
        $conversation = ChatbotConversation::create([
            'user_id' => Auth::id(),
            'session_id' => $sessionId,
            'user_message' => $userMessage,
            'bot_response' => $response['message'],
            'intent' => $response['intent'],
            'entities' => $response['entities'],
            'confidence_score' => $response['confidence'],
            'response_type' => $response['type'],
            'context' => $response['context'],
            'ip_address' => $request->ip()
        ]);


        return response()->json([
            'message' => $response['message'],
            'session_id' => $sessionId,
            'intent' => $response['intent'],
            'confidence' => $response['confidence'],
            'type' => $response['type'],
            'suggestions' => $response['suggestions'] ?? []
        ]);
    }

    /**
     * Submit feedback for chatbot response
     */
    public function submitFeedback(Request $request)
    {
        $validated = $request->validate([
            'conversation_id' => 'required|exists:chatbot_conversations,id',
            'rating' => 'required|integer|between:1,5',
            'feedback_text' => 'nullable|string|max:500'
        ]);

        $conversation = ChatbotConversation::findOrFail($validated['conversation_id']);
        $conversation->update([
            'feedback_rating' => $validated['rating'],
            'feedback_text' => $validated['feedback_text']
        ]);

        return response()->json(['success' => true]);
    }

    /**
     * Get conversation history for a session
     */
    public function getHistory(Request $request)
    {
        $validated = $request->validate([
            'session_id' => 'required|string'
        ]);

        $conversations = ChatbotConversation::where('session_id', $validated['session_id'])
            ->orderBy('created_at')
            ->get();

        return response()->json($conversations);
    }

    /**
     * Display the specified conversation
     */
    public function show($id)
    {
        $conversation = ChatbotConversation::with('user')->findOrFail($id);
        
        // Get related conversations in the same session
        $sessionConversations = ChatbotConversation::where('session_id', $conversation->session_id)
            ->orderBy('created_at')
            ->get();

        return Inertia::render('Admin/Chatbot/Show', [
            'conversation' => $conversation,
            'sessionConversations' => $sessionConversations
        ]);
    }

    /**
     * Remove the specified conversation
     */
    public function destroy($id)
    {
        try {
            $conversation = ChatbotConversation::findOrFail($id);
            // Check if user has permission to delete this conversation
            if (auth()->user()->role !== 'admin' && $conversation->user_id !== auth()->id()) {
                return redirect()->route('admin.chatbot.index')
                    ->with('error', 'You do not have permission to delete this conversation.');
            }

            // Store conversation details for logging
            $sessionId = $conversation->session_id;
            $userId = $conversation->user_id;
            
            // Delete the conversation
            $conversation->delete();

            // Log the deletion for audit purposes
            \Log::info('Chatbot conversation deleted', [
                'deleted_by' => auth()->id(),
                'conversation_id' => $conversation->id,
                'session_id' => $sessionId,
                'original_user_id' => $userId
            ]);

            return redirect()->route('admin.chatbot.index')
                ->with('success', 'Conversation deleted successfully.');
                
        } catch (\Exception $e) {
            \Log::error('Failed to delete chatbot conversation', [
                'conversation_id' => $conversation->id,
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);

            return redirect()->route('admin.chatbot.index')
                ->with('error', 'Failed to delete conversation. Please try again.');
        }
    }

    /**
     * Generate chatbot response (placeholder for AI integration)
     */
    private function generateChatbotResponse(string $message, array $context = [])
    {
        // This is a placeholder implementation
        // In a real implementation, this would integrate with an AI service
        
        $message = strtolower($message);
        $intent = 'general';
        $confidence = 0.8;
        $entities = [];
        $responseType = 'text';
        $suggestions = [];

        // Simple keyword-based responses for demonstration
        if (str_contains($message, 'kpi') || str_contains($message, 'indicator')) {
            $intent = 'kpi_inquiry';
            $response = 'I can help you with KPI-related questions. You can ask me about KPI status, progress, or create new KPIs.';
            $suggestions = ['Show KPI dashboard', 'Create new KPI', 'KPI progress report'];
        } elseif (str_contains($message, 'milestone')) {
            $intent = 'milestone_inquiry';
            $response = 'I can assist with milestone management. What would you like to know about milestones?';
            $suggestions = ['Upcoming milestones', 'Overdue milestones', 'Create milestone'];
        } elseif (str_contains($message, 'report')) {
            $intent = 'report_request';
            $response = 'I can help generate various reports. What type of report do you need?';
            $suggestions = ['KPI Summary Report', 'Pillar Progress Report', 'Department Performance'];
        } elseif (str_contains($message, 'alert') || str_contains($message, 'notification')) {
            $intent = 'alert_inquiry';
            $response = 'I can help you manage alerts and notifications. What would you like to do?';
            $suggestions = ['View recent alerts', 'Create new alert', 'Alert settings'];
        } elseif (str_contains($message, 'hello') || str_contains($message, 'hi')) {
            $intent = 'greeting';
            $response = 'Hello! I\'m your SRAP 2.0 Digital Twin assistant. I can help you with KPIs, milestones, reports, and more. How can I assist you today?';
            $suggestions = ['Show dashboard', 'KPI status', 'Generate report'];
        } elseif (str_contains($message, 'help')) {
            $intent = 'help_request';
            $response = 'I can help you with:\n• KPI management and tracking\n• Milestone monitoring\n• Report generation\n• Alert management\n• Dashboard insights\n\nWhat would you like to know more about?';
            $suggestions = ['KPI help', 'Report help', 'Dashboard help'];
        } else {
            $response = 'I understand you\'re asking about "' . $message . '". While I\'m still learning, I can help you with KPIs, milestones, reports, and alerts. Could you please be more specific?';
            $suggestions = ['Show KPIs', 'View reports', 'Check alerts'];
        }

        return [
            'message' => $response,
            'intent' => $intent,
            'entities' => $entities,
            'confidence' => $confidence,
            'type' => $responseType,
            'context' => array_merge($context, ['last_intent' => $intent]),
            'suggestions' => $suggestions
        ];
    }
}
