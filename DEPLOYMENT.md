# Deploying CEP Grouper

This document provides instructions for deploying the CEP Grouper application to production.

## Prerequisites

- A Vercel account (recommended) or another hosting platform
- A PostgreSQL database (recommended for production)
- Node.js and npm installed locally

## Deployment Options

### Option 1: Deploy to Vercel (Recommended)

1. Create an account on [Vercel](https://vercel.com) if you don't have one
2. Install the Vercel CLI: `npm install -g vercel`
3. Push your code to a GitHub repository
4. Connect your GitHub account to Vercel
5. Import your repository in Vercel
6. Configure the following environment variables in the Vercel dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_SECRET`: A secure random string for NextAuth.js
   - `NEXTAUTH_URL`: The URL of your deployed application
7. Deploy your application

### Option 2: Manual Deployment

1. Set up environment variables:
   - Copy `.env.production.example` to `.env.production`
   - Fill in the required values
2. Build the application:
   ```
   npm run build
   ```
3. Start the production server:
   ```
   npm start
   ```

## Database Setup for Production

1. Create a PostgreSQL database
2. Update the `DATABASE_URL` environment variable with your PostgreSQL connection string
3. Run the Prisma migrations:
   ```
   npx prisma migrate deploy
   ```
4. Seed the database with initial data:
   ```
   npx prisma db seed
   ```

## Verifying Your Deployment

After deploying, visit your application URL and verify:
- User registration and login work correctly
- Group creation and joining functionality works
- Application history is visible
- All UI elements are properly styled and responsive

## Troubleshooting

- Check the server logs for any errors
- Verify that all environment variables are set correctly
- Ensure that the database is properly migrated and seeded
- Test all functionality after deployment
