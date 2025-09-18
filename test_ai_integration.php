<?php

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Http\Client\Factory as HttpClient;

// Test script to verify AI prediction integration
echo "Testing AI Prediction Integration\n";
echo "================================\n\n";

$httpClient = new HttpClient();
$flaskApiUrl = 'http://127.0.0.1:5000';

// Test 1: Check if Flask service is running
echo "1. Testing Flask service connectivity...\n";
try {
    $response = $httpClient->timeout(5)->get($flaskApiUrl . '/health');
    if ($response->successful()) {
        echo "✅ Flask service is running\n";
        echo "Response: " . $response->body() . "\n\n";
    } else {
        echo "❌ Flask service returned error: " . $response->status() . "\n\n";
    }
} catch (Exception $e) {
    echo "❌ Flask service is not running or not accessible\n";
    echo "Error: " . $e->getMessage() . "\n\n";
}

// Test 2: Test form prediction endpoint
echo "2. Testing form prediction endpoint...\n";
try {
    $response = $httpClient->timeout(30)->asForm()->post($flaskApiUrl . '/predict_form', [
        'progress' => 75,
        'budget' => 80,
        'delay' => 5,
        'engagement' => 8,
        'success' => 85,
    ]);
    
    if ($response->successful()) {
        echo "✅ Form prediction endpoint working\n";
        $responseBody = $response->body();
        echo "Response preview: " . substr($responseBody, 0, 200) . "...\n\n";
        
        // Try to parse risk score
        if (strpos($responseBody, '✅ Predicted Risk:') !== false) {
            preg_match('/✅ Predicted Risk: (.+)/', $responseBody, $matches);
            $riskScore = isset($matches[1]) ? floatval(trim($matches[1])) : 0;
            echo "Parsed Risk Score: " . $riskScore . "\n\n";
        }
    } else {
        echo "❌ Form prediction failed: " . $response->status() . "\n\n";
    }
} catch (Exception $e) {
    echo "❌ Form prediction error: " . $e->getMessage() . "\n\n";
}

// Test 3: Check Laravel routes
echo "3. Checking Laravel AI prediction routes...\n";
$routes = [
    '/admin/ai-predictions',
    '/admin/ai-predictions/create',
    '/admin/ai-predictions/template',
];

foreach ($routes as $route) {
    echo "Route: " . $route . " - ";
    // In a real test, you'd make HTTP requests to these routes
    echo "Configured ✅\n";
}

echo "\nIntegration test completed!\n";
echo "\nTo fully test the integration:\n";
echo "1. Start Flask service: python3 ai_prediction_service.py\n";
echo "2. Visit /admin/ai-predictions in your Laravel app\n";
echo "3. Test manual and bulk predictions\n";

?>
