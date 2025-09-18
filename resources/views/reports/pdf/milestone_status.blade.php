<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Milestone Status Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
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
        .milestone-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        .milestone-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
        }
        .milestone-info {
            flex: 1;
        }
        .milestone-name {
            font-size: 16px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 5px;
        }
        .milestone-kpi {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 10px;
        }
        .milestone-status {
            text-align: right;
        }
        .status-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 5px;
            display: inline-block;
        }
        .status-not-started { background: #f3f4f6; color: #374151; }
        .status-in-progress { background: #fef3c7; color: #92400e; }
        .status-completed { background: #dcfce7; color: #166534; }
        .status-overdue { background: #fee2e2; color: #dc2626; }
        .priority-badge {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
        }
        .priority-high { background: #fee2e2; color: #dc2626; }
        .priority-medium { background: #fef3c7; color: #92400e; }
        .priority-low { background: #f0f9ff; color: #0369a1; }
        .progress-section {
            margin-bottom: 15px;
        }
        .progress-bar {
            width: 100%;
            height: 16px;
            background: #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 5px;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981, #059669);
            border-radius: 8px;
        }
        .progress-text {
            font-size: 12px;
            color: #6b7280;
            text-align: center;
        }
        .dates-section {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 15px;
        }
        .deliverables-section {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 10px;
            margin-top: 10px;
        }
        .deliverables-title {
            font-size: 12px;
            font-weight: bold;
            color: #374151;
            margin-bottom: 8px;
        }
        .deliverable-item {
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 3px;
            padding-left: 10px;
            position: relative;
        }
        .deliverable-item:before {
            content: "•";
            position: absolute;
            left: 0;
        }
        .summary-section {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
        }
        .summary-item {
            text-align: center;
        }
        .summary-number {
            font-size: 20px;
            font-weight: bold;
            color: #2563eb;
        }
        .summary-label {
            font-size: 12px;
            color: #6b7280;
            margin-top: 5px;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
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

    <div class="summary-section">
        <h3>Milestone Status Overview</h3>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-number">{{ $data['total_milestones'] }}</div>
                <div class="summary-label">Total Milestones</div>
            </div>
            <div class="summary-item">
                <div class="summary-number">{{ $data['completed_milestones'] }}</div>
                <div class="summary-label">Completed</div>
            </div>
            <div class="summary-item">
                <div class="summary-number">{{ $data['in_progress_milestones'] }}</div>
                <div class="summary-label">In Progress</div>
            </div>
            <div class="summary-item">
                <div class="summary-number">{{ $data['overdue_milestones'] }}</div>
                <div class="summary-label">Overdue</div>
            </div>
        </div>
    </div>

    @foreach($data['milestones'] as $milestone)
    <div class="milestone-card">
        <div class="milestone-header">
            <div class="milestone-info">
                <div class="milestone-name">{{ $milestone->name }}</div>
                <div class="milestone-kpi">
                    KPI: {{ $milestone->kpi->name ?? 'N/A' }}
                    @if($milestone->kpi && $milestone->kpi->pillar)
                        | {{ $milestone->kpi->pillar->name }}
                    @endif
                </div>
            </div>
            <div class="milestone-status">
                <span class="status-badge status-{{ str_replace(' ', '-', strtolower($milestone->status)) }}">
                    {{ $milestone->status }}
                </span>
                <br>
                <span class="priority-badge priority-{{ $milestone->priority }}">
                    {{ ucfirst($milestone->priority) }} Priority
                </span>
            </div>
        </div>
        
        <div class="progress-section">
            <div class="progress-bar">
                <div class="progress-fill" style="width: {{ $milestone->completion_percentage }}%"></div>
            </div>
            <div class="progress-text">{{ $milestone->completion_percentage }}% Complete</div>
        </div>
        
        <div class="dates-section">
            <div>Start: {{ $milestone->start_date ? $milestone->start_date->format('M d, Y') : 'Not set' }}</div>
            <div>Due: {{ $milestone->due_date ? $milestone->due_date->format('M d, Y') : 'Not set' }}</div>
            <div>Completed: {{ $milestone->completed_at ? $milestone->completed_at->format('M d, Y') : 'Not completed' }}</div>
        </div>
        
        @if($milestone->deliverables && is_array($milestone->deliverables) && count($milestone->deliverables) > 0)
        <div class="deliverables-section">
            <div class="deliverables-title">Key Deliverables:</div>
            @foreach($milestone->deliverables as $deliverable)
            <div class="deliverable-item">{{ $deliverable }}</div>
            @endforeach
        </div>
        @endif
        
        @if($milestone->notes)
        <div style="margin-top: 10px; font-size: 11px; color: #6b7280; font-style: italic;">
            Notes: {{ $milestone->notes }}
        </div>
        @endif
    </div>
    @endforeach

    <div class="footer">
        <p>NITDA SRAP 2.0 - Strategic Roadmap and Action Plan | Generated by KPI Tracking System</p>
    </div>
</body>
</html>
