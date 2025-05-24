# Script to be run during Vercel build to ensure PostgreSQL database is used

# Print status message
echo "Running Vercel build setup..."

# Make sure we're using PostgreSQL in schema.prisma for Vercel
cp prisma/schema.postgresql.prisma prisma/schema.prisma

# Generate Prisma client
npx prisma generate

echo "Vercel build setup complete. Using PostgreSQL database configuration."
