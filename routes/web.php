<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\KpiController;
use App\Http\Controllers\MilestoneController;
use App\Http\Controllers\SrapPillarController;
use App\Http\Controllers\AiPredictionController;
use App\Http\Controllers\Admin\AlertController as AlertController;
use App\Http\Controllers\Admin\ReportController as ReportController;
use App\Http\Controllers\Admin\ChatbotController as ChatbotController;
use App\Http\Controllers\Admin\UserManagementController as UserManagementController;
use App\Http\Controllers\Admin\ProgressUploadController as ProgressUploadController;
use App\Http\Controllers\Admin\ScenarioSimulationController as ScenarioSimulationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Main Dashboard - accessible to all authenticated users
Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])->name('dashboard');

// Admin Routes (dashboard settings only)
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('dashboard/admin')->group(function () {
    Route::get('/settings', function () {
        return Inertia::render('Admin/Settings');
    })->name('admin.settings');
});

// Researcher routes removed (role retired)

// Data Analyst routes removed (role retired)

// General authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // KPI Management Routes
    Route::resource('kpis', KpiController::class);

    // Milestone Management Routes
    Route::resource('milestones', MilestoneController::class);

    // SRAP Pillar Management Routes
    Route::resource('srap-pillars', SrapPillarController::class);

    // Initiative Management Routes
    Route::resource('initiatives', \App\Http\Controllers\InitiativeController::class);
    Route::post('initiatives/{initiative}/link-kpis', [\App\Http\Controllers\InitiativeController::class, 'linkKpis'])->name('initiatives.link-kpis');
    Route::delete('initiatives/{initiative}/kpis/{kpi}', [\App\Http\Controllers\InitiativeController::class, 'unlinkKpi'])->name('initiatives.unlink-kpi');

    // Global Dashboard Routes
    Route::get('/global-dashboard', [\App\Http\Controllers\GlobalDashboardController::class, 'index'])->name('global-dashboard');
    Route::get('/global-dashboard/export', [\App\Http\Controllers\GlobalDashboardController::class, 'export'])->name('global-dashboard.export');

    // Reports Export Routes
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/global/export', [\App\Http\Controllers\ReportsExportController::class, 'exportGlobalReport'])->name('global.export');
        Route::get('/pillar/{pillar}/export', [\App\Http\Controllers\ReportsExportController::class, 'exportPillarReport'])->name('pillar.export');
        Route::get('/department/{department}/export', [\App\Http\Controllers\ReportsExportController::class, 'exportDepartmentReport'])->name('department.export');
        Route::get('/initiative/{initiative}/export', [\App\Http\Controllers\ReportsExportController::class, 'exportInitiativeReport'])->name('initiative.export');
    });

    // AI Predictions Routes
    Route::prefix('ai-predictions')->name('ai-predictions.')->group(function () {
        Route::get('/', [AiPredictionController::class, 'index'])->name('index');
        Route::post('/manual-predict', [AiPredictionController::class, 'manualPredict'])->name('manual-predict');
        Route::post('/bulk-predict', [AiPredictionController::class, 'bulkPredict'])->name('bulk-predict');
        Route::get('/download/{id}', [AiPredictionController::class, 'download'])->name('download');
        Route::get('/kpi-performance/{kpi}', [AiPredictionController::class, 'kpiPerformance'])->name('kpi-performance');
        Route::get('/milestone-completion/{milestone}', [AiPredictionController::class, 'milestoneCompletion'])->name('milestone-completion');
        Route::get('/risk-assessment', [AiPredictionController::class, 'riskAssessment'])->name('risk-assessment');
        Route::get('/trend-analysis', [AiPredictionController::class, 'trendAnalysis'])->name('trend-analysis');
        Route::post('/generate-insights', [AiPredictionController::class, 'generateInsights'])->name('generate-insights');
        Route::post('/update-model', [AiPredictionController::class, 'updateModel'])->name('update-model');
    });

    // Scenario Simulation Routes
    Route::prefix('scenarios')->name('scenarios.')->group(function () {
        Route::get('/', [ScenarioSimulationController::class, 'index'])->name('index');
        Route::post('/simulate', [ScenarioSimulationController::class, 'simulate'])->name('simulate');
        Route::get('/results/{id}', [ScenarioSimulationController::class, 'results'])->name('results');
        Route::post('/compare', [ScenarioSimulationController::class, 'compare'])->name('compare');
        Route::get('/export/{id}', [ScenarioSimulationController::class, 'export'])->name('export');
        Route::delete('/{id}', [ScenarioSimulationController::class, 'destroy'])->name('destroy');
    });

    // Admin Routes (split by permissions)
    Route::prefix('admin')->name('admin.')->group(function () {
        // Admin-only features
        Route::middleware('role:admin')->group(function () {
            Route::resource('alerts', AlertController::class);
            Route::post('alerts/{alert}/acknowledge', [AlertController::class, 'acknowledge'])->name('alerts.acknowledge');
            Route::post('alerts/mark-read', [AlertController::class, 'markMultipleAsRead'])->name('alerts.mark-read');
            Route::get('alerts/unread-count', [AlertController::class, 'getUnreadCount'])->name('alerts.unread-count');

            Route::resource('reports', ReportController::class);
            Route::get('reports/{report}/download/{format}', [ReportController::class, 'download'])->name('reports.download');
            Route::post('reports/{report}/regenerate', [ReportController::class, 'regenerate'])->name('reports.regenerate');


            Route::resource('users', UserManagementController::class);
            Route::post('users/{user}/reset-password', [UserManagementController::class, 'resetPassword'])->name('users.reset-password');
            Route::post('users/{user}/toggle-status', [UserManagementController::class, 'toggleStatus'])->name('users.toggle-status');
            Route::post('users/bulk-action', [UserManagementController::class, 'bulkAction'])->name('users.bulk-action');

            Route::resource('kpis', KpiController::class);
            Route::post('kpis/{kpi}/update-progress', [KpiController::class, 'updateProgress'])->name('kpis.update-progress');

            Route::resource('scenarios', ScenarioSimulationController::class);
            Route::post('scenarios/simulate', [ScenarioSimulationController::class, 'simulate'])->name('scenarios.simulate');
            Route::post('scenarios/compare', [ScenarioSimulationController::class, 'compare'])->name('scenarios.compare');
            Route::get('scenarios/{simulation}/export/{format?}', [ScenarioSimulationController::class, 'export'])->name('scenarios.export');

            // AI Predictions specific routes (must be before resource routes)
            Route::get('ai-predictions/template', [\App\Http\Controllers\Admin\AiPredictionController::class, 'downloadTemplate'])->name('ai-predictions.template');
            Route::get('ai-predictions/export', [\App\Http\Controllers\Admin\AiPredictionController::class, 'export'])->name('ai-predictions.export');
            Route::post('ai-predictions/bulk', [\App\Http\Controllers\Admin\AiPredictionController::class, 'bulkPredict'])->name('ai-predictions.bulk');
            Route::resource('ai-predictions', \App\Http\Controllers\Admin\AiPredictionController::class);
        });

        // Shared with Admin, Data Officers, HODs, and Staff (with finer-grained restrictions inside)
        Route::middleware('role:admin,data_officer,hod,staff')->group(function () {
            // Chatbot routes - accessible to all authenticated users
            Route::resource('chatbot', ChatbotController::class);
            Route::post('chatbot/message', [ChatbotController::class, 'processMessage'])->name('chatbot.message');
            Route::get('chatbot/history/{session_id}', [ChatbotController::class, 'getHistory'])->name('chatbot.history');
            Route::post('chatbot/{conversation}/feedback', [ChatbotController::class, 'submitFeedback'])->name('chatbot.feedback');
            
            Route::resource('progress-upload', ProgressUploadController::class);
            Route::get('progress-upload/template/{type}', [ProgressUploadController::class, 'downloadTemplate'])->name('progress-upload.template');
            Route::post('progress-upload/process', [ProgressUploadController::class, 'processUpload'])->name('progress-upload.process')->middleware('role:data_officer,staff');
            Route::post('progress-upload/{progress}/approve', [ProgressUploadController::class, 'approveProgress'])->name('progress-upload.approve');
            Route::post('progress-upload/{progress}/reject', [ProgressUploadController::class, 'rejectProgress'])->name('progress-upload.reject');
            Route::get('progress-upload/pending-approvals', [ProgressUploadController::class, 'getPendingApprovals'])->name('progress-upload.pending-approvals');
            Route::get('progress-upload/{upload}/download', [ProgressUploadController::class, 'downloadFile'])->name('progress-upload.download')->middleware('role:hod');
            // DO/Staff only: create & store
            Route::get('progress-upload/create', [ProgressUploadController::class, 'create'])->name('progress-upload.create')->middleware('role:data_officer,staff');
            Route::post('progress-upload', [ProgressUploadController::class, 'store'])->name('progress-upload.store')->middleware('role:data_officer,staff');
        });
    });
});

// Security and AI Developer routes removed (roles retired)

// AI Chatbot Routes - accessible to all authenticated users
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/ai/chatbot', function () {
        return Inertia::render('AI/Chatbot');
    })->name('ai.chatbot');
});

// Data Officer Routes
Route::middleware(['auth', 'verified', 'role:data_officer'])->prefix('dashboard/data-officer')->group(function () {
    Route::get('/upload', [\App\Http\Controllers\DataOfficer\DataOfficerController::class, 'upload'])->name('data-officer.upload');
    Route::get('/reports', [\App\Http\Controllers\DataOfficer\DataOfficerController::class, 'reports'])->name('data-officer.reports');
});

// HOD Routes
Route::middleware(['auth', 'verified', 'role:hod'])->prefix('dashboard/hod')->group(function () {
    Route::get('/approvals', [\App\Http\Controllers\HOD\HODController::class, 'approvals'])->name('hod.approvals');
    Route::get('/department-overview', [\App\Http\Controllers\HOD\HODController::class, 'departmentOverview'])->name('hod.department-overview');
});

// Error Routes
Route::get('/403', function () {
    return Inertia::render('Error/403');
})->name('error.403');

require __DIR__.'/auth.php';
