# Production setup script for Windows (PowerShell)

Write-Host "Setting up CEP Grouper for production..." -ForegroundColor Green

# Check if .env.production exists
if (-not (Test-Path .env.production)) {
  Write-Host "Error: .env.production file not found!" -ForegroundColor Red
  Write-Host "Please create an .env.production file based on .env.production.example" -ForegroundColor Yellow
  exit 1
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

# Run database migrations
Write-Host "Running database migrations..." -ForegroundColor Green
npx prisma migrate deploy

# Seed the database
Write-Host "Seeding the database..." -ForegroundColor Green
npx prisma db seed

# Build the application
Write-Host "Building the application..." -ForegroundColor Green
npm run build

Write-Host "Setup complete! You can now start the application with 'npm start'" -ForegroundColor Green
