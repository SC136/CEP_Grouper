# Switch to development environment with SQLite
Write-Host "Switching to SQLite development environment..." -ForegroundColor Green

# Make a backup of current schema if it exists
if (Test-Path "prisma/schema.prisma") {
    Copy-Item -Path "prisma/schema.prisma" -Destination "prisma/schema.prisma.backup" -Force
}

# Copy SQLite schema
Copy-Item -Path "prisma/schema.sqlite.prisma" -Destination "prisma/schema.prisma" -Force

# Use local environment variables
if (-not (Test-Path ".env.local")) {
    Write-Host ".env.local doesn't exist. Creating with default SQLite configuration..." -ForegroundColor Yellow
    @"
# Local development environment variables
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="dev-local-secret"
"@ | Out-File -FilePath ".env.local" -Encoding utf8
}

# Make a backup of the .env file
if (Test-Path ".env") {
    Copy-Item -Path ".env" -Destination ".env.backup" -Force
}

# Copy local env to .env
Copy-Item -Path ".env.local" -Destination ".env" -Force

Write-Host "Environment switched to local SQLite development" -ForegroundColor Green
Write-Host "You can now run: 'npm run dev'" -ForegroundColor Cyan
