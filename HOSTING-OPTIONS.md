# Hosting Options for CEP Grouper

This document outlines several options for hosting your CEP Grouper application. Choose the option that best suits your needs and technical comfort level.

## Option 1: Railway (Recommended for beginners)

Railway is an easy-to-use platform that can host both your application and database.

### Steps:

1. Create an account at [Railway](https://railway.app/) (you can use your GitHub account)

2. Create a new project and select "Deploy from GitHub repo"

3. Connect your GitHub repository

4. Add a PostgreSQL database to your project:
   - Click "New" → "Database" → "PostgreSQL"

5. Configure environment variables:
   - Go to your project → "Variables" tab
   - Add the following variables:
     - `DATABASE_URL`: Use the connection string from your Railway PostgreSQL database
     - `NEXTAUTH_SECRET`: Generate a secure random string
     - `NEXTAUTH_URL`: This will be your Railway app URL (e.g., https://your-app-name.up.railway.app)

6. Deploy your application:
   - Railway will automatically detect your Next.js application
   - Railway will build and deploy your application

7. Run database migrations:
   - In Railway, go to your project
   - Click on "Shell" to open a terminal
   - Run the following commands:
     ```
     npx prisma migrate deploy
     npx prisma db seed
     ```

8. Your application is now deployed and accessible via the URL provided by Railway

## Option 2: Vercel (Best for Next.js applications)

Vercel is the platform created by the team behind Next.js and offers excellent integration.

### Steps:

1. See the detailed instructions in [VERCEL-DEPLOYMENT.md](./VERCEL-DEPLOYMENT.md)

## Option 3: Netlify

Netlify is another popular option with a generous free tier.

### Steps:

1. Create an account on [Netlify](https://netlify.com)

2. Click "Add new site" → "Import an existing project"

3. Connect with GitHub and select your repository

4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

5. Add environment variables:
   - Click "Site settings" → "Environment variables"
   - Add the same environment variables as mentioned in the Railway section

6. Deploy your site
   - Netlify will automatically build and deploy your application

7. Run database migrations using the Netlify CLI or by connecting directly to your database

## Option 4: Self-hosting

If you have access to a server, you can self-host the application.

### Steps:

1. SSH into your server

2. Install Node.js and npm

3. Clone your repository

4. Install dependencies:
   ```
   npm install
   ```

5. Create a `.env.production` file with your environment variables

6. Build the application:
   ```
   npm run build
   ```

7. Run database migrations:
   ```
   npx prisma migrate deploy
   npx prisma db seed
   ```

8. Start the server:
   ```
   npm start
   ```

9. Set up a reverse proxy (like Nginx) to direct traffic to your application

## Database Hosting Options

If you choose a platform that doesn't include database hosting:

1. **Neon**: Offers a generous free tier for PostgreSQL
   - [neon.tech](https://neon.tech)

2. **Supabase**: Includes PostgreSQL database with additional features
   - [supabase.com](https://supabase.com)

3. **CockroachDB**: Distributed SQL database with a free tier
   - [cockroachlabs.com](https://www.cockroachlabs.com)

4. **ElephantSQL**: PostgreSQL as a service
   - [elephantsql.com](https://www.elephantsql.com)

After setting up your database, update your `DATABASE_URL` environment variable accordingly.

## Important Notes for All Deployment Methods

1. **Database Migration**: Always run migrations after deployment:
   ```
   npx prisma migrate deploy
   ```

2. **Seeding**: Don't forget to seed the database with initial data:
   ```
   npx prisma db seed
   ```

3. **Environment Variables**: Ensure all required environment variables are set

4. **Security**: Use HTTPS for production deployments

5. **Monitoring**: Set up monitoring for your production application
