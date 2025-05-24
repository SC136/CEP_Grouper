# How to Handle Database Provider Switching

This guide explains how to work with both development (SQLite) and production (PostgreSQL) databases.

## Understanding the Issue

The error `P3019: The datasource provider 'postgresql' specified in your schema does not match the one specified in the migration_lock.toml, 'sqlite'` occurs because:

1. Your local development was initially using SQLite
2. We've updated the schema for production to use PostgreSQL 
3. Prisma won't let you switch providers with the same migration history

## Solution: Use Environment-Specific Schemas

We've set up a system that lets you easily switch between development and production environments:

1. `schema.sqlite.prisma` - For local development with SQLite
2. `schema.postgresql.prisma` - For production with PostgreSQL 
3. Scripts that switch between them

## How to Use

### For Local Development (SQLite)

```powershell
# Switch to development environment
npm run use:dev

# Start development server
npm run dev

# When making schema changes, create migrations with
npx prisma migrate dev
```

### For Production Deployment (PostgreSQL)

```powershell
# Switch to production environment
npm run use:prod

# Deploy migrations to production database
npx prisma migrate deploy

# Seed the database with initial data
npx prisma db seed
```

### Quick Setup Commands

We've added convenience scripts to package.json:

- `npm run setup:dev` - Switch to development environment and run migrations
- `npm run setup:prod` - Switch to production environment, deploy migrations, and seed the database

## Important Notes

1. **NEVER** mix migrations between environments. SQLite and PostgreSQL migrations are not compatible.

2. If you need to make schema changes:
   - First make them in the appropriate schema file (`schema.sqlite.prisma` or `schema.postgresql.prisma`)
   - Then copy the changes to the other schema file to keep them in sync
   - Run migrations in the appropriate environment

3. If you get the P3019 error, it means you're trying to run migrations for one database provider using migrations created for another provider. Use the switching scripts to fix this.

4. Always make sure your `.env.local` (for development) and `.env.production` (for production) files have the correct database URLs.

## Troubleshooting

If you encounter issues with migrations:

1. Switch to the correct environment first: `npm run use:dev` or `npm run use:prod`
2. Check that your schema file matches the expected database provider
3. Ensure your `.env` file has the correct DATABASE_URL
4. For severe migration issues, consider creating a fresh migration history:
   ```powershell
   # For development only - DO NOT do this in production
   rm -r prisma/migrations
   npm run setup:dev
   ```
