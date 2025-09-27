<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Department Performance Report</title>
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
        .header .logo {
            width: 60px;
            height: 60px;
            margin: 0 auto 15px;
            display: block;
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
        .department-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        .department-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .department-name {
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
        }
        .department-stats {
            display: flex;
            gap: 20px;
            font-size: 12px;
        }
        .stat-item {
            text-align: center;
        }
        .stat-number {
            font-size: 16px;
            font-weight: bold;
            color: #2563eb;
        }
        .stat-label {
            color: #6b7280;
            margin-top: 2px;
        }
        .progress-bar {
            width: 100%;
            height: 16px;
            background: #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 15px;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981, #059669);
            border-radius: 8px;
        }
        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-top: 15px;
        }
        .kpi-item {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 10px;
        }
        .kpi-name {
            font-size: 12px;
            font-weight: bold;
            color: #374151;
            margin-bottom: 5px;
        }
        .kpi-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .kpi-progress {
            font-size: 11px;
            color: #6b7280;
        }
        .status-badge {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
        }
        .status-active { background: #dcfce7; color: #166534; }
        .status-completed { background: #dbeafe; color: #1e40af; }
        .status-on-hold { background: #fef3c7; color: #92400e; }
        .status-cancelled { background: #fee2e2; color: #dc2626; }
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
        <img src="{{ public_path('logo-removebg-preview.png') }}" alt="NITDA Logo" class="logo">
        <h1>{{ $report->title }}</h1>
        <p>{{ $report->description }}</p>
        <p>Period: {{ $report->start_date->format('M d, Y') }} - {{ $report->end_date->format('M d, Y') }}</p>
        <p>Generated on: {{ now()->format('M d, Y H:i') }}</p>
    </div>

    <div class="summary-section">
        <h3>Department Performance Overview</h3>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-number">{{ count($data['departments']) }}</div>
                <div class="summary-label">Total Departments</div>
            </div>
            <div class="summary-item">
                <div class="summary-number">{{ $data['total_kpis'] }}</div>
                <div class="summary-label">Total KPIs</div>
            </div>
            <div class="summary-item">
                <div class="summary-number">{{ number_format($data['avg_performance'], 1) }}%</div>
                <div class="summary-label">Avg Performance</div>
            </div>
            <div class="summary-item">
                <div class="summary-number">{{ $data['active_departments'] }}</div>
                <div class="summary-label">Active Departments</div>
            </div>
        </div>
    </div>

    @foreach($data['departments'] as $department)
    <div class="department-card">
        <div class="department-header">
            <div class="department-name">{{ $department->name }}</div>
            <div class="department-stats">
                <div class="stat-item">
                    <div class="stat-number">{{ $department->kpis_count }}</div>
                    <div class="stat-label">KPIs</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">{{ number_format($department->avg_progress, 1) }}%</div>
                    <div class="stat-label">Progress</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">{{ $department->completed_kpis }}</div>
                    <div class="stat-label">Completed</div>
                </div>
            </div>
        </div>
        
        <div class="progress-bar">
            <div class="progress-fill" style="width: {{ $department->avg_progress }}%"></div>
        </div>
        
        <p style="font-size: 12px; color: #6b7280; margin-bottom: 15px;">
            {{ $department->description ?? 'No description available' }}
        </p>
        
        <div class="kpi-grid">
            @foreach($department->kpis as $kpi)
            <div class="kpi-item">
                <div class="kpi-name">{{ $kpi->name }}</div>
                <div class="kpi-details">
                    <div class="kpi-progress">{{ $kpi->progress_percentage }}%</div>
                    <span class="status-badge status-{{ $kpi->status }}">
                        {{ ucfirst($kpi->status) }}
                    </span>
                </div>
            </div>
            @endforeach
        </div>
    </div>
    @endforeach

    <div class="footer">
        <p>NITDA SRAP 2.0 - Strategic Roadmap and Action Plan | Generated by KPI Tracking System</p>
    </div>
</body>
</html>
