# Test Admin Endpoints
Write-Host "Testing Admin Endpoints..." -ForegroundColor Cyan

# Step 1: Login as admin
Write-Host "`n1. Testing admin login..." -ForegroundColor Yellow
$loginBody = @{
    username = "admin"
    password = "admin123"
    user_type = "admin"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8000/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.access_token
    Write-Host "✓ Login successful! Token: $($token.Substring(0,20))..." -ForegroundColor Green
} catch {
    Write-Host "✗ Login failed: $_" -ForegroundColor Red
    exit
}

# Step 2: Test /admin/doctors endpoint
Write-Host "`n2. Testing /admin/doctors endpoint..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $doctors = Invoke-RestMethod -Uri "http://localhost:8000/admin/doctors" -Method Get -Headers $headers
    Write-Host "✓ Success! Found $($doctors.Count) doctors" -ForegroundColor Green
    Write-Host "First doctor: $($doctors[0].full_name) - $($doctors[0].specialization)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

# Step 3: Test /admin/stats endpoint
Write-Host "`n3. Testing /admin/stats endpoint..." -ForegroundColor Yellow
try {
    $stats = Invoke-RestMethod -Uri "http://localhost:8000/admin/stats" -Method Get -Headers $headers
    Write-Host "✓ Success!" -ForegroundColor Green
    Write-Host "Total Patients: $($stats.total_patients)" -ForegroundColor Cyan
    Write-Host "Total Doctors: $($stats.total_doctors)" -ForegroundColor Cyan
    Write-Host "Total Appointments: $($stats.total_appointments)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

# Step 4: Test /admin/appointments endpoint
Write-Host "`n4. Testing /admin/appointments endpoint..." -ForegroundColor Yellow
try {
    $appointments = Invoke-RestMethod -Uri "http://localhost:8000/admin/appointments" -Method Get -Headers $headers
    Write-Host "✓ Success! Found $($appointments.Count) appointments" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Test Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
