<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kpis;
use App\Models\KpiProgress;
use App\Models\Milestone;
use App\Models\UploadedFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ProgressUploadController extends Controller
{
    /**
     * Show the upload form
     */
    public function index(Request $request)
    {
        $query = UploadedFile::with('uploader');

        // Role-based visibility
        $user = Auth::user();
        if ($user->role === 'hod') {
            // HOD: see uploads from users in their department
            $query->whereHas('uploader', function($q) use ($user) {
                $q->where('department_id', $user->department_id);
            });
        } elseif (in_array($user->role, ['data_officer', 'staff'])) {
            // Data Officer/Staff: see only own uploads
            $query->where('uploaded_by', $user->id);
        }

        // Apply search filter
        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('original_filename', 'like', '%' . $request->search . '%')
                  ->orWhere('filename', 'like', '%' . $request->search . '%');
            });
        }

        // Apply type filter
        if ($request->filled('type')) {
            $query->where('file_type', $request->type);
        }

        // Apply status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $uploads = $query->orderBy('created_at', 'desc')->paginate(10);
        
        return Inertia::render('Admin/ProgressUpload', [
            'uploads' => $uploads,
            'filters' => $request->only(['search', 'type', 'status'])
        ]);
    }

    /**
     * Show the form for creating a new upload
     */
    public function create()
    {
        $recentUploads = UploadedFile::with('uploader')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('Admin/ProgressUpload/Create', [
            'recentUploads' => $recentUploads
        ]);
    }

    /**
     * Store a newly created upload in storage
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240', // 10MB max
            'type' => 'required|in:kpi_progress,milestone_progress',
            'overwrite_existing' => 'boolean'
        ]);
        
        $file = $request->file('file');
        $type = $validated['type'];
        $overwriteExisting = $validated['overwrite_existing'] ?? false;
        
        try {
            DB::beginTransaction();
            
            // Auto-detect type from file headers to prevent template mismatch
            $detectedType = $this->detectFileTypeByHeaders($file);
            if ($detectedType && $detectedType !== $type) {
                $type = $detectedType;
            }

            // Store file and create database record
            $uploadedFile = $this->storeUploadedFile($file, $type);
            
            // Process the file
            $results = $this->processUploadedFile($file, $type, $overwriteExisting);
            
            // Determine file status based on role and type
            $shouldPending = in_array(Auth::user()->role, ['data_officer', 'staff']) && $type === 'kpi_progress';

            // Update the uploaded file record with results
            $uploadedFile->update([
                'status' => 'pending',
                'records_processed' => $results['success'],
                'errors_count' => $results['errors'],
                'error_details' => $results['error_details'],
                'processing_results' => $results,
                'processed_at' => now()
            ]);
            
            DB::commit();
            
            return redirect()->route('admin.progress-upload.show', $uploadedFile->id)
                ->with('success', "Upload completed successfully. {$results['success']} records processed, {$results['errors']} errors.")
                ->with('upload_results', $results);

        } catch (\Exception $e) {
            
            DB::rollBack();
            
            // Update file status to failed if it was created
            if (isset($uploadedFile)) {
                $uploadedFile->update([
                    'status' => 'failed',
                    'error_details' => [['error' => $e->getMessage()]],
                    'processed_at' => now()
                ]);
            }
            
            return back()->with('error', 'Upload failed: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified upload
     */
    public function show($id)
    {
        $upload = UploadedFile::with('uploader')->findOrFail($id);
        
        return Inertia::render('Admin/ProgressUpload/Show', [
            'upload' => $upload
        ]);
    }

    /**
     * Show the form for editing the specified upload
     */
    public function edit($id)
    {
        // Not applicable for uploads, redirect to index
        return redirect()->route('admin.progress-upload.index');
    }

    /**
     * Update the specified upload in storage
     */
    public function update(Request $request, $id)
    {
        // Not applicable for uploads, redirect to index
        return redirect()->route('admin.progress-upload.index');
    }

    /**
     * Remove the specified upload from storage
     */
    public function destroy($id)
    {
        try {
            $upload = UploadedFile::findOrFail($id);
            
            // Delete the physical file if it exists
            if ($upload->file_path && Storage::exists($upload->file_path)) {
                Storage::delete($upload->file_path);
            }
            
            // Delete the database record
            $upload->delete();
            
            return redirect()->route('admin.progress-upload.index')
                ->with('success', 'Upload deleted successfully');
                
        } catch (\Exception $e) {
            return redirect()->route('admin.progress-upload.index')
                ->with('error', 'Failed to delete upload: ' . $e->getMessage());
        }
    }

    /**
     * Download template files
     */
    public function downloadTemplate($type)
    {
        if (!in_array($type, ['kpi_progress', 'milestone_progress'])) {
            abort(404, 'Template not found');
        }

        $templatePath = $this->generateTemplate($type);
        
        return Storage::download($templatePath, $type . '_template.xlsx');
    }

    /**
     * Upload and process Excel/CSV file
     */
    public function upload(Request $request)
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240', // 10MB max
            'type' => 'required|in:kpi_progress,milestone_progress',
            'overwrite_existing' => 'boolean'
        ]);

        $file = $request->file('file');
        $type = $validated['type'];
        $overwriteExisting = $validated['overwrite_existing'] ?? false;

        try {
            DB::beginTransaction();

            // Auto-detect type from file headers to prevent template mismatch
            $detectedType = $this->detectFileTypeByHeaders($file);
            if ($detectedType && $detectedType !== $type) {
                $type = $detectedType;
            }

            $results = $this->processUploadedFile($file, $type, $overwriteExisting);

            DB::commit();

            // Redirect to a show/details view if possible. Since 'upload' doesn't create an UploadedFile record,
            // keep behavior consistent with store() by redirecting back with flash for now.
            return back()->with('success', 
                "Upload completed successfully. {$results['success']} records processed, {$results['errors']} errors."
            )->with('upload_results', $results);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->with('error', 'Upload failed: ' . $e->getMessage());
        }
    }

    /**
     * Process uploaded file based on type
     */
    private function processUploadedFile($file, $type, $overwriteExisting)
    {
        $data = Excel::toArray([], $file)[0]; // Get first sheet
        
        if (empty($data)) {
            throw new \Exception('The uploaded file is empty or could not be read.');
        }
        
        $headers = array_shift($data); // Remove header row
        
        // Clean and filter out empty headers
        $headers = array_filter(array_map('trim', $headers), function($header) {
            return !empty($header);
        });
        
        // Validate headers before processing
        $this->validateFileHeaders($headers, $type);
        
        $results = [
            'success' => 0,
            'errors' => 0,
            'error_details' => []
        ];

        // Skip empty rows
        $data = array_filter($data, function($row) {
            return !empty(array_filter($row, function($cell) {
                return !is_null($cell) && $cell !== '';
            }));
        });

        foreach ($data as $rowIndex => $row) {
            try {
                if ($type === 'kpi_progress') {
                    $this->processKpiProgressRow($row, $headers, $overwriteExisting);
                } else {
                    $this->processMilestoneProgressRow($row, $headers, $overwriteExisting);
                }
                
                $results['success']++;
            } catch (\Exception $e) {
                $results['errors']++;
                $results['error_details'][] = [
                    'row' => $rowIndex + 2, // +2 because we removed header and arrays are 0-indexed
                    'error' => $e->getMessage()
                ];
            }
        }

        return $results;
    }

    /**
     * Validate file headers match expected format
     */
    private function validateFileHeaders($headers, $type)
    {
        // Clean headers - remove extra spaces and normalize
        $cleanHeaders = array_map(function($header) {
            return trim($header);
        }, $headers);
        
        $requiredHeaders = $this->getRequiredHeaders($type);
        $missingHeaders = [];
        
        foreach ($requiredHeaders as $requiredHeader) {
            if (!in_array($requiredHeader, $cleanHeaders)) {
                $missingHeaders[] = $requiredHeader;
            }
        }
        
        if (!empty($missingHeaders)) {
            // Add debugging information
            $foundHeaders = implode(', ', $cleanHeaders);
            throw new \Exception("Missing required columns: " . implode(', ', $missingHeaders) . ". Found headers: [{$foundHeaders}]. Please download and use the correct template.");
        }
    }

    /**
     * Process KPI progress row
     */
    private function processKpiProgressRow($row, $headers, $overwriteExisting)
    {
        $headerMap = array_flip($headers);
        
        $kpiId = $row[$headerMap['KPI ID']] ?? null;
        $reportingDate = $row[$headerMap['Reporting Date']] ?? null;
        $currentValue = $row[$headerMap['Current Value']] ?? null;
        $notes = $row[$headerMap['Notes']] ?? '';
        $entryType = $row[$headerMap['Entry Type']] ?? 'upload';
        
        // Validate entry type against allowed values
        $validEntryTypes = ['manual', 'upload', 'api', 'system'];
        if (!in_array($entryType, $validEntryTypes)) {
            $entryType = 'upload'; // Default to upload for file uploads
        }
        $source = $row[$headerMap['Source']] ?? 'excel_upload';
        
        // Add approval status for workflow
        $needsApproval = in_array(Auth::user()->role, ['data_officer', 'staff']);

        // Validate required fields
        if (!$kpiId || !$reportingDate || $currentValue === null) {
            throw new \Exception('Missing required fields: KPI ID, Reporting Date, or Current Value');
        }

        // Find KPI
        $kpi = Kpis::find($kpiId);
        if (!$kpi) {
            throw new \Exception("KPI with ID {$kpiId} not found");
        }

        // Department restriction: Data Officer/Staff can only upload for their department
        if (in_array(Auth::user()->role, ['data_officer', 'staff']) && $kpi->department_id !== Auth::user()->department_id) {
            throw new \Exception('You can only upload KPI progress for KPIs in your department.');
        }

        // Parse date
        $reportingDate = \Carbon\Carbon::parse($reportingDate);

        // Check for existing progress entry
        $existingProgress = KpiProgress::where('kpi_id', $kpiId)
            ->whereDate('reporting_date', $reportingDate)
            ->first();

        if ($existingProgress && !$overwriteExisting) {
            throw new \Exception("Progress entry already exists for KPI {$kpiId} on {$reportingDate->format('Y-m-d')}. Use overwrite option to replace.");
        }

        // Create or update progress entry
        $progressData = [
            'kpi_id' => $kpiId,
            'reporting_date' => $reportingDate,
            'value' => $currentValue,
            'notes' => $notes,
            'entry_type' => $entryType,
            'source' => $source,
            'reported_by' => Auth::id(),
            'verified_by' => $needsApproval ? null : Auth::id(), // Auto-approve for non-data officers
            'verification_status' => $needsApproval ? 'pending' : 'verified',
            'metadata' => [
                'uploaded_via' => 'excel',
                'upload_timestamp' => now()->toISOString(),
                'needs_approval' => $needsApproval
            ]
        ];

        if ($existingProgress) {
            $existingProgress->update($progressData);
        } else {
            KpiProgress::create($progressData);
        }

        // Only update KPI current value if the entry is verified (not pending)
        if (!$needsApproval) {
            $latestProgress = KpiProgress::where('kpi_id', $kpiId)
                ->where('verification_status', 'verified')
                ->orderBy('reporting_date', 'desc')
                ->first();

            if ($latestProgress && $latestProgress->reporting_date->isSameDay($reportingDate)) {
                $kpi->update(['current_value' => $currentValue]);
            }
        }
    }

    /**
     * Process milestone progress row
     */
    private function processMilestoneProgressRow($row, $headers, $overwriteExisting)
    {
        $headerMap = array_flip($headers);
        
        $milestoneId = $row[$headerMap['Milestone ID']] ?? null;
        $completionPercentage = $row[$headerMap['Completion Percentage']] ?? null;
        $status = $row[$headerMap['Status']] ?? null;
        $notes = $row[$headerMap['Notes']] ?? '';
        $completedDate = $row[$headerMap['Completed Date']] ?? null;

        // Validate required fields
        if (!$milestoneId || $completionPercentage === null) {
            throw new \Exception('Missing required fields: Milestone ID or Completion Percentage');
        }

        // Find milestone
        $milestone = Milestone::find($milestoneId);
        if (!$milestone) {
            throw new \Exception("Milestone with ID {$milestoneId} not found");
        }

        // Department restriction: Data Officer/Staff can only upload for their department
        if (in_array(Auth::user()->role, ['data_officer', 'staff'])) {
            $milestoneKpi = $milestone->kpi; // relation defined on model
            if ($milestoneKpi && $milestoneKpi->department_id !== Auth::user()->department_id) {
                throw new \Exception('You can only upload milestone updates for KPIs in your department.');
            }
        }

        // Validate completion percentage
        if ($completionPercentage < 0 || $completionPercentage > 100) {
            throw new \Exception('Completion percentage must be between 0 and 100');
        }

        // Update milestone
        $updateData = [
            'completion_percentage' => $completionPercentage,
            'notes' => $notes
        ];

        if ($status) {
            $validStatuses = ['pending', 'in_progress', 'completed', 'on_hold', 'cancelled'];
            if (!in_array($status, $validStatuses)) {
                throw new \Exception("Invalid status: {$status}");
            }
            $updateData['status'] = $status;
        }

        if ($completedDate) {
            $updateData['completed_date'] = \Carbon\Carbon::parse($completedDate);
        }

        // Auto-set status based on completion percentage
        if ($completionPercentage == 100 && !$status) {
            $updateData['status'] = 'completed';
            $updateData['completed_date'] = now();
        } elseif ($completionPercentage > 0 && $completionPercentage < 100 && !$status) {
            $updateData['status'] = 'in_progress';
        }

        $milestone->update($updateData);
    }

    /**
     * Generate template file
     */
    private function generateTemplate($type)
    {
        $templateData = [];
        $filename = "templates/{$type}_template.xlsx";

        if ($type === 'kpi_progress') {
            $templateData = [
                ['KPI ID', 'KPI Title', 'Reporting Date', 'Current Value', 'Notes', 'Entry Type', 'Source'],
                ['1', 'Sample KPI', '2024-01-15', '75', 'Sample progress note', 'upload', 'excel_upload'],
                ['2', 'Another KPI', '2024-01-15', '82.5', 'Another sample note', 'upload', 'excel_upload']
            ];
        } else {
            $templateData = [
                ['Milestone ID', 'Milestone Title', 'Completion Percentage', 'Status', 'Notes', 'Completed Date'],
                ['1', 'Sample Milestone', '75', 'in_progress', 'Sample milestone note', ''],
                ['2', 'Another Milestone', '100', 'completed', 'Completed milestone', '2024-01-15']
            ];
        }

        // Create simple CSV-like Excel file
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        
        foreach ($templateData as $rowIndex => $rowData) {
            foreach ($rowData as $colIndex => $cellData) {
                $sheet->setCellValueByColumnAndRow($colIndex + 1, $rowIndex + 1, $cellData);
            }
        }

        // Style header row
        $headerRange = 'A1:' . \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex(count($templateData[0])) . '1';
        $sheet->getStyle($headerRange)->getFont()->setBold(true);
        $sheet->getStyle($headerRange)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
            ->getStartColor()->setRGB('E2E8F0');

        // Auto-size columns
        foreach (range('A', \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex(count($templateData[0]))) as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        
        // Ensure directory exists
        Storage::makeDirectory('templates');
        $fullPath = Storage::path($filename);
        
        $writer->save($fullPath);
        
        return $filename;
    }

    /**
     * Store uploaded file and create database record
     */
    private function storeUploadedFile($file, $type)
    {
        $originalName = $file->getClientOriginalName();
        $filename = time() . '_' . $originalName;
        $filePath = $file->storeAs('uploads/progress', $filename);

        return UploadedFile::create([
            'filename' => $filename,
            'original_filename' => $originalName,
            'file_path' => $filePath,
            'file_type' => $type,
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'status' => 'pending',
            'uploaded_by' => Auth::id()
        ]);
    }

    /**
     * Get recent upload history
     */
    private function getRecentUploads()
    {
        return UploadedFile::with('uploader')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
    }

    /**
     * Validate uploaded file structure
     */
    public function validateFile(Request $request)
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv',
            'type' => 'required|in:kpi_progress,milestone_progress'
        ]);

        try {
            $file = $request->file('file');
            $type = $validated['type'];
            
            $data = Excel::toArray([], $file)[0];
            $headers = $data[0] ?? [];
            
            $requiredHeaders = $this->getRequiredHeaders($type);
            $missingHeaders = array_diff($requiredHeaders, $headers);
            
            if (!empty($missingHeaders)) {
                return response()->json([
                    'valid' => false,
                    'errors' => ['Missing required headers: ' . implode(', ', $missingHeaders)]
                ]);
            }
            
            return response()->json([
                'valid' => true,
                'preview' => array_slice($data, 0, 6), // First 5 data rows + header
                'total_rows' => count($data) - 1 // Exclude header
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'valid' => false,
                'errors' => ['File validation failed: ' . $e->getMessage()]
            ]);
        }
    }

    /**
     * Get required headers for file type
     */
    private function getRequiredHeaders($type)
    {
        if ($type === 'kpi_progress') {
            return ['KPI ID', 'Reporting Date', 'Current Value'];
        } else {
            return ['Milestone ID', 'Completion Percentage'];
        }
    }

    /**
     * Detect file type by inspecting header row
     */
    private function detectFileTypeByHeaders($file)
    {
        try {
            $data = Excel::toArray([], $file)[0] ?? [];
            if (empty($data)) {
                return null;
            }
            $headers = $data[0] ?? [];
            // Clean headers
            $headers = array_filter(array_map('trim', $headers), function($h) {
                return $h !== '' && $h !== null;
            });

            $kpiRequired = $this->getRequiredHeaders('kpi_progress');
            $milRequired = $this->getRequiredHeaders('milestone_progress');

            $hasKpi = empty(array_diff($kpiRequired, $headers));
            $hasMil = empty(array_diff($milRequired, $headers));

            if ($hasKpi && !$hasMil) {
                return 'kpi_progress';
            }
            if ($hasMil && !$hasKpi) {
                return 'milestone_progress';
            }
            // Ambiguous or no match
            return null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Approve uploaded file and its KPI progress entries (for HOD role)
     */
    public function approveProgress(Request $request, $uploadId)
    {
        $user = Auth::user();
        
        // Only HOD can approve
        if ($user->role !== 'hod') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $uploadedFile = UploadedFile::with('uploader')->findOrFail($uploadId);
        
        // Check if user can approve this upload (same department)
        if ($uploadedFile->uploader->department_id !== $user->department_id) {
            return response()->json(['error' => 'Can only approve uploads from your department'], 403);
        }

        // Update the uploaded file status to completed
        $uploadedFile->update([
            'status' => 'completed',
            'approved_by' => $user->id,
            'approved_at' => now()
        ]);

        // Find and approve all related KPI progress entries from this upload
        $kpiProgressEntries = KpiProgress::where('verification_status', 'pending')
            ->where('source', 'excel_upload')
            ->where('reported_by', $uploadedFile->uploaded_by)
            ->whereDate('created_at', $uploadedFile->created_at->toDateString())
            ->get();

        foreach ($kpiProgressEntries as $progress) {
            $progress->update([
                'verified_by' => $user->id,
                'verification_status' => 'verified',
                'verified_at' => now()
            ]);

            // Update KPI current value if this is the latest verified entry
            $latestProgress = KpiProgress::where('kpi_id', $progress->kpi_id)
                ->where('verification_status', 'verified')
                ->orderBy('reporting_date', 'desc')
                ->first();

            if ($latestProgress && $latestProgress->id === $progress->id) {
                $progress->kpi->update(['current_value' => $progress->value]);
            }
        }

        return response()->json([
            'message' => 'Upload approved successfully', 
            'approved_entries' => $kpiProgressEntries->count()
        ]);
    }

    /**
     * Reject uploaded file and its KPI progress entries
     */
    public function rejectProgress(Request $request, $uploadId)
    {
        try {
            $user = Auth::user();
            
            \Log::info('Reject request received', [
                'user_id' => $user->id,
                'user_role' => $user->role,
                'upload_id' => $uploadId,
                'request_data' => $request->all()
            ]);
            
            // Only HOD can reject
            if ($user->role !== 'hod') {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:500'
        ]);

        $uploadedFile = UploadedFile::with('uploader')->findOrFail($uploadId);
        
        // Check if user can reject this upload (same department)
        if ($uploadedFile->uploader->department_id !== $user->department_id) {
            return response()->json(['error' => 'Can only reject uploads from your department'], 403);
        }

        // Update the uploaded file status to rejected
        $uploadedFile->update([
            'status' => 'failed',
            'rejected_by' => $user->id,
            'rejected_at' => now(),
            'rejection_reason' => $validated['rejection_reason']
        ]);

        // Find and reject all related KPI progress entries from this upload
        $kpiProgressEntries = KpiProgress::where('verification_status', 'pending')
            ->where('source', 'excel_upload')
            ->where('reported_by', $uploadedFile->uploaded_by)
            ->whereDate('created_at', $uploadedFile->created_at->toDateString())
            ->get();

        foreach ($kpiProgressEntries as $progress) {
            $progress->update([
                'verified_by' => $user->id,
                'verification_status' => 'rejected',
                'verified_at' => now(),
                'rejection_reason' => $validated['rejection_reason']
            ]);
        }

        return response()->json([
            'message' => 'Upload rejected successfully',
            'rejected_entries' => $kpiProgressEntries->count()
        ]);
        
        } catch (\Exception $e) {
            \Log::error('Error rejecting upload', [
                'upload_id' => $uploadId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'Failed to reject upload: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get pending uploaded files for HOD approval
     */
    public function getPendingApprovals()
    {
        $user = Auth::user();
        
        // Allow HOD and Admin access
        if (!in_array($user->role, ['hod', 'admin'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $query = UploadedFile::with(['uploader'])
            ->where('status', 'pending')
            ->where('file_type', 'kpi_progress'); // Only KPI progress uploads need approval

        // Filter by department for HOD - only see uploads from users in their department
        if ($user->role === 'hod') {
            $query->whereHas('uploader', function($q) use ($user) {
                $q->where('department_id', $user->department_id);
            });
        }

        $pendingApprovals = $query->orderBy('created_at', 'desc')->paginate(15);

        // Transform the data to include additional info for the frontend
        $pendingApprovals->getCollection()->transform(function ($upload) {
            return [
                'id' => $upload->id,
                'original_filename' => $upload->original_filename,
                'file_type' => $upload->file_type,
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

        return response()->json($pendingApprovals);
    }

    /**
     * Download uploaded file for review (HOD only)
     */
    public function downloadFile($uploadId)
    {
        $user = Auth::user();
        
        // Only HOD can download for review
        if ($user->role !== 'hod') {
            abort(403, 'Unauthorized access');
        }

        $uploadedFile = UploadedFile::with('uploader')->findOrFail($uploadId);
        
        // Check if HOD can access this file (same department)
        if ($uploadedFile->uploader->department_id !== $user->department_id) {
            abort(403, 'Can only download files from your department');
        }

        // Check if file exists
        if (!Storage::exists($uploadedFile->file_path)) {
            abort(404, 'File not found');
        }

        return Storage::download($uploadedFile->file_path, $uploadedFile->original_filename);
    }

    /**
     * Process upload (alias for store method to match route)
     */
    public function processUpload(Request $request)
    {
        return $this->store($request);
    }
}
