#!/bin/bash
# Production setup script

echo "Setting up CEP Grouper for production..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
  echo "Error: .env.production file not found!"
  echo "Please create an .env.production file based on .env.production.example"
  exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Seed the database
echo "Seeding the database..."
npx prisma db seed

# Build the application
echo "Building the application..."
npm run build

echo "Setup complete! You can now start the application with 'npm start'"
