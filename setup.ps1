# TaskFlow Quick Setup Script
# Run this in PowerShell to quickly set up the project

Write-Host "🚀 TaskFlow Setup Script" -ForegroundColor Cyan
Write-Host "========================`n" -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js is not installed. Please install Node.js v18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js $nodeVersion detected`n" -ForegroundColor Green

# Setup Backend
Write-Host "📦 Setting up Backend..." -ForegroundColor Yellow
Set-Location backend
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend dependencies installed`n" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

# Create .env file
if (-Not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "✅ Created .env file from template" -ForegroundColor Green
    Write-Host "⚠️  Please edit backend/.env with your MongoDB URI and JWT secret`n" -ForegroundColor Yellow
}

Set-Location ..

# Setup Frontend
Write-Host "📦 Setting up Frontend..." -ForegroundColor Yellow
Set-Location frontend
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend dependencies installed`n" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

# Create .env file
if (-Not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "✅ Created .env file from template`n" -ForegroundColor Green
}

Set-Location ..

Write-Host "`n🎉 Setup Complete!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Edit backend/.env with your MongoDB connection string" -ForegroundColor White
Write-Host "2. Open two terminals:" -ForegroundColor White
Write-Host "   Terminal 1: cd backend && npm run dev" -ForegroundColor Gray
Write-Host "   Terminal 2: cd frontend && npm run dev" -ForegroundColor Gray
Write-Host "3. Visit http://localhost:5173 in your browser" -ForegroundColor White
Write-Host "`n📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - README.md: Quick start guide" -ForegroundColor Gray
Write-Host "   - PROJECT_SUMMARY.md: Complete project overview" -ForegroundColor Gray
Write-Host "   - FRONTEND_IMPLEMENTATION_GUIDE.md: Ready-to-use component code" -ForegroundColor Gray
Write-Host "   - TASKFLOW_PLAN.md: Detailed implementation plan`n" -ForegroundColor Gray
