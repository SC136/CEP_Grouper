# Deploying CEP Grouper to Vercel

## Important Changes Made to Fix Deployment Error

We've made the following changes to address the Prisma generation error on Vercel:

1. **Updated `package.json`**:
   - Added a `postinstall` script to automatically generate the Prisma client
   - Modified the `build` script to run `prisma generate` before building

2. **Created `vercel.json`**:
   - Added a configuration file specifically for Vercel
   - Explicitly set the build command to include Prisma generation

3. **Updated Deployment Documentation**:
   - Enhanced the VERCEL-DEPLOYMENT.md guide with specific steps
   - Added detailed PostgreSQL database setup instructions
   - Improved the database migration instructions

## Database Provider Switching Solution

We've also added a solution for switching between development (SQLite) and production (PostgreSQL) databases:

1. **Created separate schema files**:
   - `schema.sqlite.prisma` - For local development
   - `schema.postgresql.prisma` - For production deployment

2. **Added environment switching scripts**:
   - `switch-to-dev.ps1` - Switches to SQLite for development
   - `switch-to-prod.ps1` - Switches to PostgreSQL for production

3. **Added convenience npm scripts**:
   - `npm run use:dev` - Switch to development environment
   - `npm run use:prod` - Switch to production environment
   - `npm run setup:dev` - Set up development environment with migrations
   - `npm run setup:prod` - Set up production environment with migrations and seed data

For detailed instructions on managing database provider switching, see [DATABASE-SWITCHING.md](./DATABASE-SWITCHING.md).

## Next Steps for Deployment

1. **Push these changes to your GitHub repository**:
   ```powershell
   git add .
   git commit -m "Fix Prisma generation for Vercel deployment"
   git push
   ```

2. **Deploy to Vercel**:
   - Follow the updated instructions in VERCEL-DEPLOYMENT.md
   - Make sure to set up your PostgreSQL database correctly
   - Don't forget to run migrations after deployment

3. **Verify Your Deployment**:
   - Test all functionality after deployment
   - Share the URL and QUICK-START.md with your friends

## Understanding the Fix

The error occurred because Vercel caches dependencies during the build process. This means Prisma's auto-generation of the client isn't triggered normally. Our changes force Prisma to generate its client during both the installation and build phases, ensuring that the client is properly generated and available when the application runs.

## Need More Help?

If you encounter any other issues during deployment, refer to:
- [Prisma's guide for Vercel deployments](https://pris.ly/d/vercel-build)
- [Vercel's Next.js deployment documentation](https://nextjs.org/docs/deployment)
