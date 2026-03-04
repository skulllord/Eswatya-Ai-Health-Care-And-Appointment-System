# Admin Login Troubleshooting Script

Write-Host "`n=== ESWATYA ADMIN LOGIN TROUBLESHOOTING ===" -ForegroundColor Cyan
Write-Host ""

# Check Backend
Write-Host "1. Checking Backend Server..." -ForegroundColor Yellow
$backendPort = netstat -ano | Select-String ":8000.*LISTENING"
if ($backendPort) {
    Write-Host "   ✅ Backend is running on port 8000" -ForegroundColor Green
    $backendPID = ($backendPort -split '\s+')[-1]
    Write-Host "   Process ID: $backendPID" -ForegroundColor Gray
} else {
    Write-Host "   ❌ Backend is NOT running on port 8000" -ForegroundColor Red
    Write-Host "   Please start backend: cd backend && python main.py" -ForegroundColor Yellow
}

# Check Frontend
Write-Host "`n2. Checking Frontend Server..." -ForegroundColor Yellow
$frontendPort = netstat -ano | Select-String ":5173.*LISTENING"
if ($frontendPort) {
    Write-Host "   ✅ Frontend is running on port 5173" -ForegroundColor Green
    $frontendPID = ($frontendPort -split '\s+')[-1]
    Write-Host "   Process ID: $frontendPID" -ForegroundColor Gray
} else {
    Write-Host "   ❌ Frontend is NOT running on port 5173" -ForegroundColor Red
    Write-Host "   Please start frontend: cd frontend && npm run dev" -ForegroundColor Yellow
}

# Test Backend API
Write-Host "`n3. Testing Backend API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Backend API is responding" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Backend API is not responding" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Admin Login
Write-Host "`n4. Testing Admin Login Endpoint..." -ForegroundColor Yellow
try {
    $loginBody = @{
        username = "admin"
        password = "admin123"
        user_type = "admin"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8000/auth/login" `
        -Method Post `
        -Body $loginBody `
        -ContentType "application/json" `
        -TimeoutSec 5

    if ($loginResponse.access_token) {
        Write-Host "   ✅ Admin login endpoint is working!" -ForegroundColor Green
        Write-Host "   Token received: $($loginResponse.access_token.Substring(0,50))..." -ForegroundColor Gray
        
        # Test admin stats endpoint
        Write-Host "`n5. Testing Admin Stats Endpoint..." -ForegroundColor Yellow
        try {
            $statsResponse = Invoke-RestMethod -Uri "http://localhost:8000/admin/stats" `
                -Headers @{Authorization = "Bearer $($loginResponse.access_token)"} `
                -TimeoutSec 5
            
            Write-Host "   ✅ Admin stats endpoint is working!" -ForegroundColor Green
            Write-Host "   Total Patients: $($statsResponse.total_patients)" -ForegroundColor Gray
            Write-Host "   Total Doctors: $($statsResponse.total_doctors)" -ForegroundColor Gray
            Write-Host "   Total Appointments: $($statsResponse.total_appointments)" -ForegroundColor Gray
        } catch {
            Write-Host "   ❌ Admin stats endpoint failed" -ForegroundColor Red
            Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "   ❌ Admin login endpoint failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Check Database
Write-Host "`n6. Checking Database..." -ForegroundColor Yellow
if (Test-Path "backend/eswatya_healthcare.db") {
    Write-Host "   ✅ Database file exists" -ForegroundColor Green
    $dbSize = (Get-Item "backend/eswatya_healthcare.db").Length / 1KB
    Write-Host "   Database size: $([math]::Round($dbSize, 2)) KB" -ForegroundColor Gray
} else {
    Write-Host "   ❌ Database file not found" -ForegroundColor Red
    Write-Host "   Please run: cd backend && python init_db.py" -ForegroundColor Yellow
}

# Summary
Write-Host "`n=== SUMMARY ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Admin Credentials:" -ForegroundColor White
Write-Host "  Username: admin" -ForegroundColor Gray
Write-Host "  Password: admin123" -ForegroundColor Gray
Write-Host "  User Type: Admin" -ForegroundColor Gray
Write-Host ""
Write-Host "Login URL: http://localhost:5173/login" -ForegroundColor White
Write-Host ""

if ($backendPort -and $frontendPort) {
    Write-Host "✅ Both servers are running. You should be able to login!" -ForegroundColor Green
    Write-Host ""
    Write-Host "If you still can't login:" -ForegroundColor Yellow
    Write-Host "  1. Clear browser cache (Ctrl+Shift+Delete)" -ForegroundColor Gray
    Write-Host "  2. Hard refresh (Ctrl+Shift+R)" -ForegroundColor Gray
    Write-Host "  3. Try incognito/private mode" -ForegroundColor Gray
    Write-Host "  4. Check browser console for errors (F12)" -ForegroundColor Gray
} else {
    Write-Host "⚠️  One or more servers are not running" -ForegroundColor Yellow
    Write-Host "Please start the missing server(s)" -ForegroundColor Yellow
}

Write-Host ""
