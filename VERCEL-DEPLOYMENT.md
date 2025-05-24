# Deploying to Vercel

This guide provides step-by-step instructions for deploying the CEP Grouper application to Vercel.

## Prerequisites

- A [GitHub](https://github.com) account
- A [Vercel](https://vercel.com) account (you can sign up with your GitHub account)

## Step 1: Push Your Code to GitHub

1. Create a new repository on GitHub
2. Initialize your local repository (if not already done):
   ```
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Connect to your GitHub repository:
   ```
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

## Step 2: Set Up a PostgreSQL Database

You can use any PostgreSQL provider. Here are some options:

- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Neon](https://neon.tech/) (offers a generous free tier)
- [Supabase](https://supabase.com/) (includes PostgreSQL)
- [Railway](https://railway.app/)

After setting up your database, make note of your connection string (URL).

## Step 3: Deploy to Vercel

1. Log in to [Vercel](https://vercel.com)
2. Click "Add New..." and select "Project"
3. Import your GitHub repository
4. Configure the project:
   - Set the framework preset to "Next.js"
   - Add the following environment variables:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `NEXTAUTH_SECRET`: A secure random string (you can generate one with `openssl rand -base64 32`)
     - `NEXTAUTH_URL`: The URL of your deployed application (will be automatically set by Vercel)
   - Leave other settings as default
5. Click "Deploy"

## Step 4: Run Database Migrations

After your initial deployment, you need to set up your database:

1. In the Vercel dashboard, go to your project
2. Click on "Deployments"
3. Find your latest deployment and click on it
4. Go to the "Functions" tab
5. Click "View Function Logs"
6. You may see database connection errors

To fix this, you need to run Prisma migrations on your production database:

1. Locally, create a `.env.production` file with your production database URL:
   ```
   DATABASE_URL=your_production_db_connection_string
   ```
2. Run the migration and seed commands:
   ```
   npx prisma migrate deploy --preview-feature
   npx prisma db seed
   ```

## Step 5: Verify Your Deployment

1. Visit your deployed application URL (provided by Vercel)
2. Test the following functionality:
   - User registration and login
   - Group creation
   - Group joining
   - Application review
   - Application history

## Troubleshooting

- **Database Connection Issues**: Make sure your database connection string is correct and your IP is allowed in the database firewall settings
- **Missing Environment Variables**: Check that all required environment variables are set correctly in the Vercel dashboard
- **Build Failures**: Check the build logs for errors and fix any issues in your codebase

## Regular Updates

After making changes to your code:

1. Commit your changes:
   ```
   git add .
   git commit -m "Your commit message"
   git push
   ```
2. Vercel will automatically deploy your changes
3. If you made changes to the database schema, run migrations:
   ```
   npx prisma migrate deploy --preview-feature
   ```
