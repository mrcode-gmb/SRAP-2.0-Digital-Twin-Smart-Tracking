<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>KPI Summary Report</title>
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
        .summary-stats {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .stat-card {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            width: 22%;
            border: 1px solid #e2e8f0;
        }
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
        }
        .stat-label {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        .kpi-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .kpi-table th,
        .kpi-table td {
            border: 1px solid #e2e8f0;
            padding: 8px;
            text-align: left;
            font-size: 11px;
        }
        .kpi-table th {
            background: #f8fafc;
            font-weight: bold;
            color: #374151;
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
        .progress-bar {
            width: 60px;
            height: 12px;
            background: #e5e7eb;
            border-radius: 6px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: #10b981;
            border-radius: 6px;
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

    <div class="summary-stats">
        <div class="stat-card">
            <div class="stat-number">{{ $data['total_kpis'] }}</div>
            <div class="stat-label">Total KPIs</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">{{ $data['active_kpis'] }}</div>
            <div class="stat-label">Active KPIs</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">{{ $data['completed_kpis'] }}</div>
            <div class="stat-label">Completed</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">{{ number_format($data['avg_progress'], 1) }}%</div>
            <div class="stat-label">Avg Progress</div>
        </div>
    </div>

    <h3>KPI Details</h3>
    <table class="kpi-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Pillar</th>
                <th>Department</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Current</th>
                <th>Target</th>
                <th>Priority</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data['kpis'] as $kpi)
            <tr>
                <td>{{ $kpi->name }}</td>
                <td>{{ $kpi->pillar->name ?? 'N/A' }}</td>
                <td>{{ $kpi->department->name ?? 'N/A' }}</td>
                <td>
                    <span class="status-badge status-{{ $kpi->status }}">
                        {{ ucfirst($kpi->status) }}
                    </span>
                </td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: {{ $kpi->progress_percentage }}%"></div>
                    </div>
                    {{ $kpi->progress_percentage }}%
                </td>
                <td>{{ $kpi->current_value }} {{ $kpi->unit }}</td>
                <td>{{ $kpi->target_value }} {{ $kpi->unit }}</td>
                <td>{{ ucfirst($kpi->priority) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>NITDA SRAP 2.0 - Strategic Roadmap and Action Plan | Generated by KPI Tracking System</p>
    </div>
</body>
</html>
