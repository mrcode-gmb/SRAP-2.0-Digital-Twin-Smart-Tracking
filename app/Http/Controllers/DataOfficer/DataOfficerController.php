<?php

namespace App\Http\Controllers\DataOfficer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\UploadedFile;
use App\Models\Department;
use Inertia\Inertia;

class DataOfficerController extends Controller
{
    /**
     * Show upload page for Data Officer
     */
    public function upload()
    {
        return Inertia::render('DataOfficer/Upload');
    }

    /**
     * Show reports page with user's uploads
     */
    public function reports()
    {
        $user = Auth::user();
        
        // Get user's uploads
        $uploads = UploadedFile::where('uploaded_by', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        // Get upload statistics
        $stats = [
            'total_uploads' => $uploads->count(),
            'pending' => $uploads->where('status', 'pending')->count(),
            'completed' => $uploads->where('status', 'completed')->count(),
            'rejected' => $uploads->where('status', 'rejected')->count(),
        ];

        return Inertia::render('DataOfficer/Reports', [
            'uploads' => $uploads,
            'stats' => $stats
        ]);
    }
}
