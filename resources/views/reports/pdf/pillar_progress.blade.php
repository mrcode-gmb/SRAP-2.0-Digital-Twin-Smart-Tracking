<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Pillar Progress Report</title>
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
        .pillar-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        .pillar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .pillar-name {
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
        }
        .pillar-progress {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
        }
        .progress-bar {
            width: 100%;
            height: 20px;
            background: #e5e7eb;
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 15px;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981, #059669);
            border-radius: 10px;
            transition: width 0.3s ease;
        }
        .kpi-list {
            margin-top: 15px;
        }
        .kpi-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .kpi-item:last-child {
            border-bottom: none;
        }
        .kpi-name {
            font-size: 14px;
            color: #374151;
        }
        .kpi-status {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .status-badge {
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
        }
        .status-active { background: #dcfce7; color: #166534; }
        .status-completed { background: #dbeafe; color: #1e40af; }
        .status-on-hold { background: #fef3c7; color: #92400e; }
        .status-cancelled { background: #fee2e2; color: #dc2626; }
        .kpi-progress {
            font-size: 12px;
            color: #6b7280;
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
            grid-template-columns: repeat(3, 1fr);
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
        <h3>Overall Progress Summary</h3>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-number">{{ count($data['pillars']) }}</div>
                <div class="summary-label">Total Pillars</div>
            </div>
            <div class="summary-item">
                <div class="summary-number">{{ number_format($data['overall_progress'], 1) }}%</div>
                <div class="summary-label">Overall Progress</div>
            </div>
            <div class="summary-item">
                <div class="summary-number">{{ $data['total_kpis'] }}</div>
                <div class="summary-label">Total KPIs</div>
            </div>
        </div>
    </div>

    @foreach($data['pillars'] as $pillar)
    <div class="pillar-card">
        <div class="pillar-header">
            <div class="pillar-name">{{ $pillar->name }}</div>
            <div class="pillar-progress">{{ number_format($pillar->progress_percentage, 1) }}%</div>
        </div>
        
        <div class="progress-bar">
            <div class="progress-fill" style="width: {{ $pillar->progress_percentage }}%"></div>
        </div>
        
        <p style="font-size: 12px; color: #6b7280; margin-bottom: 15px;">
            {{ $pillar->description }}
        </p>
        
        <div class="kpi-list">
            <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #374151;">Associated KPIs</h4>
            @foreach($pillar->kpis as $kpi)
            <div class="kpi-item">
                <div class="kpi-name">{{ $kpi->name }}</div>
                <div class="kpi-status">
                    <span class="status-badge status-{{ $kpi->status }}">
                        {{ ucfirst($kpi->status) }}
                    </span>
                    <span class="kpi-progress">{{ $kpi->progress_percentage }}%</span>
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
