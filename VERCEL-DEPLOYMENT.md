# Deploying to Vercel

This guide provides step-by-step instructions for deploying the CEP Grouper application to Vercel.

## Prerequisites

- A [GitHub](https://github.com) account
- A [Vercel](https://vercel.com) account (you can sign up with your GitHub account)
- A PostgreSQL database (you can use Neon, Supabase, or any other PostgreSQL provider)

## Important: Fixing Prisma Generation on Vercel

Before deploying, make sure your package.json has the following scripts to avoid Prisma client generation issues:

```json
"scripts": {
  "dev": "next dev",
  "build": "prisma generate && next build",
  "start": "next start",
  "lint": "next lint",
  "postinstall": "prisma generate"
}
```

Also, create a `vercel.json` file in your project root with the following content:

```json
{
  "buildCommand": "prisma generate && next build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

These changes ensure that Prisma generates its client properly during Vercel's build process.

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

For production, you'll need a PostgreSQL database. Here are detailed steps for setting up databases with different providers:

### Option 1: Neon (Recommended for Free Tier)

1. Go to [neon.tech](https://neon.tech) and sign up for a free account
2. Create a new project
3. Once your project is created, go to the dashboard
4. In "Connection Details", select "Prisma" from the dropdown
5. Copy the connection string - it should look like:
   ```
   postgresql://[user]:[password]@[endpoint]/[database]?sslmode=require
   ```

### Option 2: Supabase

1. Go to [supabase.com](https://supabase.com) and sign up for a free account
2. Create a new project
3. Go to Settings > Database to find your connection details
4. Create a connection string in this format:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-ID].supabase.co:5432/postgres
   ```

### Option 3: Vercel Postgres

1. In your Vercel dashboard, go to "Storage"
2. Click "Create" and select "Postgres"
3. Follow the setup wizard to create your database
4. After creation, go to "Connect" tab to find your connection string

### Option 4: Railway

1. Go to [railway.app](https://railway.app) and sign up
2. Create a new project
3. Add a PostgreSQL database
4. Once provisioned, click on the database and go to "Connect"
5. Copy the Prisma connection string

After setting up your database, securely store your connection string - you'll need it for the next step.

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

After your initial deployment, you need to set up your database schema and seed it with initial data. There are two ways to do this:

### Option 1: Using Vercel CLI (Recommended)

1. Install the Vercel CLI locally:
   ```powershell
   npm install -g vercel
   ```

2. Log in to Vercel from the CLI:
   ```powershell
   vercel login
   ```

3. Link your local project to the Vercel project:
   ```powershell
   vercel link
   ```

4. Pull the production environment variables to your local machine:
   ```powershell
   vercel env pull .env.production
   ```

5. Run the database migrations:
   ```powershell
   npx prisma migrate deploy
   ```

6. Seed the database with initial class roll number ranges:
   ```powershell
   npx prisma db seed
   ```

### Option 2: Using Direct Database Connection

If you have direct access to your PostgreSQL database:

1. Create a `.env.production` file with your production database URL:
   ```plaintext
   DATABASE_URL=your_production_db_connection_string
   ```

2. Run the migration and seed commands:
   ```powershell
   npx prisma migrate deploy
   npx prisma db seed
   ```

### Troubleshooting Database Migrations

If you're having issues with migrations:

1. Verify that your PostgreSQL connection string is correct
2. Make sure your database user has the necessary permissions
3. Check the Prisma logs for detailed error messages:
   ```powershell
   npx prisma migrate deploy --verbose
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
