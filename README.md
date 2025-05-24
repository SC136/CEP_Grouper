# CEP Grouper

A web application for creating and joining groups with roll number validation. This platform allows users to form groups of up to 10 members, with features for group creation, joining applications, and roll number validation.

## 🎉 Application Deployed! 

The CEP Grouper application is now live at:

**[https://cep-grouper.vercel.app](https://cep-grouper.vercel.app)**

Share the [DEPLOYED-APP-GUIDE.md](./DEPLOYED-APP-GUIDE.md) with your friends to help them get started using the application.

## Features

- **User Authentication**: Sign up and sign in with roll number verification
- **Roll Number Validation**: Six different classes with specific roll number ranges
- **Group Management**: Create groups, apply to join groups, and manage memberships
- **Application Process**: Submit and respond to group join requests with optional notes
- **Application History**: View all past applications with status indicators
- **Responsive Design**: Works well on mobile and desktop devices

## Hosting and Deployment

We've provided several options for hosting this application for your friends to use:

- **Railway (Recommended for beginners)**: See [RAILWAY-DEPLOYMENT.md](./RAILWAY-DEPLOYMENT.md)
- **Vercel**: See [VERCEL-DEPLOYMENT.md](./VERCEL-DEPLOYMENT.md) and [VERCEL-DEPLOYMENT-FIX.md](./VERCEL-DEPLOYMENT-FIX.md) for troubleshooting
- **Other Options**: See [HOSTING-OPTIONS.md](./HOSTING-OPTIONS.md) for more deployment options

Once deployed, share the [QUICK-START.md](./QUICK-START.md) guide with your friends to help them get started with using the application.

### Quick Deployment Steps

1. Push your code to GitHub
2. Set up a PostgreSQL database
3. Deploy to Railway or Vercel following our step-by-step guides
4. Run migrations and seed the database
5. Share the application URL with your friends

## Getting Started

First, set up the database and seed the initial data:

```bash
# Generate Prisma client and create initial migration
npx prisma migrate dev --name init

# Seed the database with class roll number ranges
npx prisma db seed
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Form Handling**: React Forms
- **UI Components**: Custom components with Tailwind CSS
- **Modal Dialogs**: React Modal

## Application Structure

### Authentication Flow

1. Users sign up with their roll number, name, and password
2. Roll number is validated against predefined class ranges
3. Users sign in with roll number and password

### Group Management

1. Users can create a group, becoming the group admin
2. Users can browse available groups (with < 10 members)
3. Users can apply to join a group with optional notes
4. Group admins can approve/deny applications with feedback
5. Users can leave groups (if admin leaves, admin status transfers or group deletes)

### Roll Number Validation

The system validates roll numbers against six predefined class ranges:
- Class A: 10705 to 10767
- Class B: 10801 to 10863
- Class C: 10901 to 10963
- Class D: 11001 to 11063
- Class E: 11101 to 11163
- Class F: 11201 to 11263

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
