<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Comprehensive Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            font-size: 12px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #2563eb;
            margin: 0;
            font-size: 24px;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .executive-summary {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        }
        .summary-item {
            text-align: center;
            background: white;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
        }
        .summary-number {
            font-size: 20px;
            font-weight: bold;
            color: #2563eb;
        }
        .summary-label {
            font-size: 11px;
            color: #6b7280;
            margin-top: 5px;
        }
        .pillar-overview {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        }
        .pillar-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 15px;
        }
        .pillar-name {
            font-size: 14px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 8px;
        }
        .progress-bar {
            width: 100%;
            height: 12px;
            background: #e5e7eb;
            border-radius: 6px;
            overflow: hidden;
            margin-bottom: 8px;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981, #059669);
            border-radius: 6px;
        }
        .progress-text {
            font-size: 11px;
            color: #6b7280;
            text-align: center;
        }
        .kpi-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .kpi-table th,
        .kpi-table td {
            border: 1px solid #e2e8f0;
            padding: 6px;
            text-align: left;
            font-size: 10px;
        }
        .kpi-table th {
            background: #f8fafc;
            font-weight: bold;
            color: #374151;
        }
        .status-badge {
            padding: 2px 4px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
        }
        .status-active { background: #dcfce7; color: #166534; }
        .status-completed { background: #dbeafe; color: #1e40af; }
        .status-on-hold { background: #fef3c7; color: #92400e; }
        .status-cancelled { background: #fee2e2; color: #dc2626; }
        .milestone-list {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 15px;
        }
        .milestone-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        .milestone-item:last-child {
            border-bottom: none;
        }
        .milestone-name {
            font-size: 11px;
            color: #374151;
            flex: 1;
        }
        .milestone-progress {
            font-size: 10px;
            color: #6b7280;
            margin-right: 10px;
        }
        .department-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        .department-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 15px;
        }
        .department-name {
            font-size: 14px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
        }
        .department-stats {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: #6b7280;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
        }
        .page-break {
            page-break-before: always;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $report->title }}</h1>
        <p>{{ $report->description }}</p>
        <p>Period: {{ $report->start_date->format('M d, Y') }} - {{ $report->end_date->format('M d, Y') }}</p>
        <p>Generated on: {{ now()->format('M d, Y H:i') }}</p>
    </div>

    <!-- Executive Summary -->
    <div class="executive-summary">
        <h2 style="margin: 0 0 20px 0; font-size: 16px; color: #1f2937;">Executive Summary</h2>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-number">{{ $data['total_kpis'] }}</div>
                <div class="summary-label">Total KPIs</div>
            </div>
            <div class="summary-item">
                <div class="summary-number">{{ count($data['pillars']) }}</div>
                <div class="summary-label">SRAP Pillars</div>
            </div>
            <div class="summary-item">
                <div class="summary-number">{{ $data['total_milestones'] }}</div>
                <div class="summary-label">Milestones</div>
            </div>
            <div class="summary-item">
                <div class="summary-number">{{ number_format($data['overall_progress'], 1) }}%</div>
                <div class="summary-label">Overall Progress</div>
            </div>
        </div>
        <p style="margin: 0; font-size: 11px; color: #6b7280; line-height: 1.5;">
            This comprehensive report provides a detailed overview of the NITDA SRAP 2.0 implementation progress, 
            covering all key performance indicators, strategic pillars, departmental performance, and milestone achievements 
            for the specified reporting period.
        </p>
    </div>

    <!-- SRAP Pillars Overview -->
    <div class="section">
        <div class="section-title">SRAP Pillars Overview</div>
        <div class="pillar-overview">
            @foreach($data['pillars'] as $pillar)
            <div class="pillar-card">
                <div class="pillar-name">{{ $pillar->name }}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: {{ $pillar->progress_percentage }}%"></div>
                </div>
                <div class="progress-text">{{ number_format($pillar->progress_percentage, 1) }}% Complete</div>
                <div style="font-size: 10px; color: #6b7280; margin-top: 5px;">
                    {{ $pillar->kpis_count }} KPIs | {{ $pillar->completed_kpis }} Completed
                </div>
            </div>
            @endforeach
        </div>
    </div>

    <!-- KPI Performance Summary -->
    <div class="section page-break">
        <div class="section-title">KPI Performance Summary</div>
        <table class="kpi-table">
            <thead>
                <tr>
                    <th>KPI Name</th>
                    <th>Pillar</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Current</th>
                    <th>Target</th>
                </tr>
            </thead>
            <tbody>
                @foreach($data['kpis']->take(20) as $kpi)
                <tr>
                    <td>{{ Str::limit($kpi->name, 30) }}</td>
                    <td>{{ $kpi->pillar->name ?? 'N/A' }}</td>
                    <td>{{ $kpi->department->name ?? 'N/A' }}</td>
                    <td>
                        <span class="status-badge status-{{ $kpi->status }}">
                            {{ ucfirst($kpi->status) }}
                        </span>
                    </td>
                    <td>{{ $kpi->progress_percentage }}%</td>
                    <td>{{ $kpi->current_value }}</td>
                    <td>{{ $kpi->target_value }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @if($data['kpis']->count() > 20)
        <p style="font-size: 10px; color: #6b7280; font-style: italic;">
            Showing top 20 KPIs. Total: {{ $data['kpis']->count() }} KPIs
        </p>
        @endif
    </div>

    <!-- Department Performance -->
    <div class="section">
        <div class="section-title">Department Performance</div>
        <div class="department-grid">
            @foreach($data['departments'] as $department)
            <div class="department-card">
                <div class="department-name">{{ $department->name }}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: {{ $department->avg_progress }}%"></div>
                </div>
                <div class="progress-text">{{ number_format($department->avg_progress, 1) }}% Average Progress</div>
                <div class="department-stats">
                    <span>{{ $department->kpis_count }} KPIs</span>
                    <span>{{ $department->completed_kpis }} Completed</span>
                    <span>{{ $department->active_kpis }} Active</span>
                </div>
            </div>
            @endforeach
        </div>
    </div>

    <!-- Milestone Status -->
    <div class="section page-break">
        <div class="section-title">Milestone Status</div>
        <div class="milestone-list">
            @foreach($data['milestones'] as $milestone)
            <div class="milestone-item">
                <div class="milestone-name">{{ $milestone->name }}</div>
                <div class="milestone-progress">{{ $milestone->completion_percentage }}%</div>
                <span class="status-badge status-{{ str_replace(' ', '-', strtolower($milestone->status)) }}">
                    {{ $milestone->status }}
                </span>
            </div>
            @endforeach
        </div>
    </div>

    <div class="footer">
        <p>NITDA SRAP 2.0 - Strategic Roadmap and Action Plan | Generated by KPI Tracking System</p>
        <p>This report contains confidential information. Distribution should be limited to authorized personnel only.</p>
    </div>
</body>
</html>
