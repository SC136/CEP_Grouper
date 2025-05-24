# Railway Deployment Guide for CEP Grouper

This guide provides simple step-by-step instructions for deploying CEP Grouper to Railway, which is one of the easiest platforms for beginners.

## Step 1: Prepare Your Code

Make sure your code is pushed to GitHub:

```powershell
git add .
git commit -m "Prepare for deployment"
git push
```

## Step 2: Sign Up for Railway

1. Go to [Railway](https://railway.app)
2. Sign up using your GitHub account

## Step 3: Create a New Project

1. Click "New Project" in the Railway dashboard
2. Select "Deploy from GitHub repo"
3. Choose your CEP Grouper repository
4. Railway will automatically detect your Next.js application and start the deployment process

## Step 4: Add a PostgreSQL Database

1. In your project dashboard, click "New"
2. Select "Database"
3. Choose "PostgreSQL"
4. Wait for the database to be provisioned (this may take a minute)

## Step 5: Configure Environment Variables

1. In your project dashboard, go to the "Variables" tab
2. Add the following variables:
   - `DATABASE_URL`: Click on your PostgreSQL database service, go to "Connect" tab, and copy the "Prisma Connection URL"
   - `NEXTAUTH_SECRET`: Generate a random string using [this tool](https://generate-secret.vercel.app/32)
   - `NEXTAUTH_URL`: This will be your Railway app URL (which you'll get after deployment)

## Step 6: Deploy Your Application

1. Railway will automatically start building your application
2. You can monitor the build progress in the "Deployments" tab
3. Once the build is complete, click on your application service
4. Go to the "Settings" tab and find your application URL
5. Update your `NEXTAUTH_URL` environment variable with this URL

## Step 7: Run Database Migrations and Seed

1. In your project dashboard, click on your application service
2. Go to the "Shell" tab to open a terminal
3. Run the following commands:

```bash
npx prisma migrate deploy
npx prisma db seed
```

## Step 8: Test Your Deployment

1. Visit your application URL (found in the Settings tab)
2. Verify that you can:
   - Sign up for a new account
   - Create a group
   - Join a group
   - View application history

## Step 9: Share with Your Friends

Share the application URL with your friends. They can follow the instructions in the QUICK-START.md file to get started.

## Troubleshooting

If you encounter any issues during deployment:

1. **Build Failures**: 
   - Check the build logs for specific error messages
   - Ensure all required environment variables are set

2. **Database Connection Issues**:
   - Verify that your `DATABASE_URL` is correctly set
   - Check that your migrations have been properly applied

3. **Application Errors**:
   - Check the application logs in the Railway dashboard
   - Look for specific error messages that can guide your troubleshooting

4. **Need Help?**:
   - Railway has excellent documentation: [docs.railway.app](https://docs.railway.app)
   - The Railway Discord community is also helpful: [discord.railway.app](https://discord.railway.app)
