<#
Starts backend and frontend dev servers in new PowerShell windows with required env vars.
Usage examples:
  .\scripts\start-dev.ps1 -GoogleClientId "..." -GoogleClientSecret "..."
  .\scripts\start-dev.ps1 -GoogleClientId "..." -GoogleClientSecret "..." -ApiBase "http://localhost:8081"

The script will open two new PowerShell windows and run the backend and frontend dev commands.
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$GoogleClientId = $env:GOOGLE_CLIENT_ID,

    [Parameter(Mandatory=$false)]
    [string]$GoogleClientSecret = $env:GOOGLE_CLIENT_SECRET,

    [Parameter(Mandatory=$false)]
    [string]$ApiBase = ($env:VITE_API_BASE_URL -ne $null ? $env:VITE_API_BASE_URL : "http://localhost:8081")
)

if ([string]::IsNullOrWhiteSpace($GoogleClientId) -or [string]::IsNullOrWhiteSpace($GoogleClientSecret)) {
    Write-Host "Warning: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not provided. You can pass them as parameters." -ForegroundColor Yellow
}

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$backendPath = Join-Path $scriptRoot "..\backend"
$frontendPath = Join-Path $scriptRoot "..\frontend"

# Build command strings that set env vars in the child process before running the server
$escapedClientId = $GoogleClientId -replace '"','\"'
$escapedClientSecret = $GoogleClientSecret -replace '"','\"'
$escapedApiBase = $ApiBase -replace '"','\"'

$backendCommand = "`$env:GOOGLE_CLIENT_ID=\"$escapedClientId\"; `$env:GOOGLE_CLIENT_SECRET=\"$escapedClientSecret\"; `$env:VITE_API_BASE_URL=\"$escapedApiBase\"; cd '$backendPath'; mvn spring-boot:run"
$frontendCommand = "`$env:VITE_ENABLE_GOOGLE_OAUTH=\"true\"; `$env:VITE_API_BASE_URL=\"$escapedApiBase\"; cd '$frontendPath'; npm run dev"

Write-Host "Opening backend window..."
Start-Process powershell -ArgumentList "-NoExit","-Command",$backendCommand

Start-Sleep -Milliseconds 500
Write-Host "Opening frontend window..."
Start-Process powershell -ArgumentList "-NoExit","-Command",$frontendCommand

Write-Host "Dev servers are starting in new windows. Check the windows for logs." -ForegroundColor Green
Write-Host "To run without opening new windows, call the individual commands in existing shells." -ForegroundColor DarkCyan
