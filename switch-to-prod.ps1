# Switch to production environment with PostgreSQL
Write-Host "Switching to PostgreSQL production environment..." -ForegroundColor Green

# Make a backup of current schema if it exists
if (Test-Path "prisma/schema.prisma") {
    Copy-Item -Path "prisma/schema.prisma" -Destination "prisma/schema.prisma.backup" -Force
}

# Copy PostgreSQL schema
Copy-Item -Path "prisma/schema.postgresql.prisma" -Destination "prisma/schema.prisma" -Force

# Check for production environment variables
if (-not (Test-Path ".env.production")) {
    Write-Host ".env.production doesn't exist. Please create it with your PostgreSQL database configuration." -ForegroundColor Yellow
    Write-Host "Example contents:" -ForegroundColor Cyan
    Write-Host "DATABASE_URL=`"postgresql://username:password@hostname:port/database`"" -ForegroundColor Cyan
    Write-Host "NEXTAUTH_SECRET=`"your-secure-secret`"" -ForegroundColor Cyan
    Write-Host "NEXTAUTH_URL=`"https://your-production-url.com`"" -ForegroundColor Cyan
    exit
}

# Make a backup of the .env file
if (Test-Path ".env") {
    Copy-Item -Path ".env" -Destination ".env.backup" -Force
}

# Copy production env to .env
Copy-Item -Path ".env.production" -Destination ".env" -Force

Write-Host "Environment switched to PostgreSQL production" -ForegroundColor Green
Write-Host "You can now run migrations for production with: 'npx prisma migrate deploy'" -ForegroundColor Cyan
Write-Host "After migrations, seed the database with: 'npx prisma db seed'" -ForegroundColor Cyan