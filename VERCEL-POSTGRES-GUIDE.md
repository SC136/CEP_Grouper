# Vercel Deployment Instructions with PostgreSQL

This guide provides step-by-step instructions for deploying your application to Vercel with a PostgreSQL database.

## Prerequisites

You have already:
- Created a PostgreSQL database (Neon.tech in this case)
- Created migrations for PostgreSQL
- Successfully built your application locally

## Deployment Steps

### 1. Push your code to GitHub

Make sure your latest code is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment with PostgreSQL"
git push
```

### 2. Deploy to Vercel

1. Log in to [Vercel](https://vercel.com)
2. Create a new project and connect your GitHub repository
3. Configure the project:

   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: Override with: `prisma generate && next build`
   - **Environment Variables**:
     - `DATABASE_URL`: Your PostgreSQL connection string from Neon (the one in your .env.production)
     - `NEXTAUTH_SECRET`: Your secure secret
     - `NEXTAUTH_URL`: The URL Vercel assigns to your deployment (you'll need to update this after initial deployment)

4. Deploy your project

### 3. After Initial Deployment

1. Update the `NEXTAUTH_URL` environment variable with the URL Vercel assigned to your project
2. Trigger a new deployment

### 4. Verify Your Deployment

Test the following functionality:
- User registration and login
- Group creation
- Joining groups
- Viewing application history

## Troubleshooting

If you encounter issues:

- Check the Vercel deployment logs
- Verify your environment variables
- Make sure your PostgreSQL database is accessible from Vercel

## Switching Between Development and Production

Remember, you've set up a system to easily switch between development and production:

- For local development: `npm run use:dev` (SQLite)
- For production tasks: `npm run use:prod` (PostgreSQL)

This ensures you're always working with the correct database and schema.
