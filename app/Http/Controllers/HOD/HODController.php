<?php

namespace App\Http\Controllers\HOD;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\UploadedFile;
use App\Models\Department;
use Inertia\Inertia;

class HODController extends Controller
{
    /**
     * Show pending approvals for HOD
     */
    public function approvals()
    {
        $user = Auth::user();
        
        // Get pending uploads from users in HOD's department
        $pendingUploads = UploadedFile::with(['uploader'])
            ->where('status', 'pending')
            ->where('file_type', 'kpi_progress')
            ->whereHas('uploader', function($q) use ($user) {
                $q->where('department_id', $user->department_id);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        // Get department info
        $department = Department::find($user->department_id);

        // Transform data for frontend
        $pendingData = $pendingUploads->map(function ($upload) {
            return [
                'id' => $upload->id,
                'original_filename' => $upload->original_filename,
                'file_type' => $upload->file_type,
                'file_size' => $upload->file_size,
                'file_size_human' => $upload->getFileSizeHumanAttribute(),
                'records_processed' => $upload->records_processed,
                'errors_count' => $upload->errors_count,
                'status' => $upload->status,
                'created_at' => $upload->created_at,
                'uploader' => [
                    'id' => $upload->uploader->id,
                    'name' => $upload->uploader->name,
                    'email' => $upload->uploader->email,
                ],
                'processing_results' => $upload->processing_results,
            ];
        });

        return Inertia::render('HOD/Approvals', [
            'pendingApprovals' => $pendingData,
            'department' => $department,
            'stats' => [
                'total_pending' => $pendingData->count(),
                'department_name' => $department?->name ?? 'Unknown Department'
            ]
        ]);
    }

    /**
     * Show department overview
     */
    public function departmentOverview()
    {
        $user = Auth::user();
        $department = Department::with(['users', 'kpis'])->find($user->department_id);
        
        // Get department statistics
        $stats = [
            'total_staff' => $department?->users()->count() ?? 0,
            'total_kpis' => $department?->kpis()->count() ?? 0,
            'pending_uploads' => UploadedFile::where('status', 'pending')
                ->whereHas('uploader', function($q) use ($user) {
                    $q->where('department_id', $user->department_id);
                })->count(),
            'completed_uploads' => UploadedFile::where('status', 'completed')
                ->whereHas('uploader', function($q) use ($user) {
                    $q->where('department_id', $user->department_id);
                })->count(),
        ];

        return Inertia::render('HOD/DepartmentOverview', [
            'department' => $department,
            'stats' => $stats
        ]);
    }
}
