# Setup Database Script for Windows PowerShell
# This script runs the schema.sql file in Supabase

Write-Host "Setting up database schema..." -ForegroundColor Green

# Check if Supabase CLI is installed
if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
    Write-Host "Supabase CLI not found. Please install it:" -ForegroundColor Yellow
    Write-Host "https://supabase.com/docs/guides/cli" -ForegroundColor Yellow
    exit 1
}

# Read SQL file and execute
$sqlFile = "supabase\schema.sql"
if (Test-Path $sqlFile) {
    Write-Host "Running schema.sql..." -ForegroundColor Green
    Get-Content $sqlFile | supabase db execute
    Write-Host "Database setup complete!" -ForegroundColor Green
} else {
    Write-Host "Error: schema.sql not found at $sqlFile" -ForegroundColor Red
    exit 1
}

