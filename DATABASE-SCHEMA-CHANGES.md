# Database Schema Compatibility Guide

This document provides guidance on maintaining compatibility between different environments when changing the database schema. It addresses the lessons learned from recent fixes to the application.

## Important Schema Fields to Watch

### User-Group Relationship

In the current schema:
- Users are directly related to Groups via the `groupId` field in the `User` model
- There is no separate `GroupMember` model
- Groups have a many-to-one relationship with Users via the `members` field

```prisma
// User model
model User {
  // ...other fields
  memberOf      Group?         @relation("GroupMembers", fields: [groupId], references: [id])
  groupId       String?
}

// Group model
model Group {
  // ...other fields
  members   User[]   @relation("GroupMembers")
}
```

### GroupApplication Fields

In the current schema:
- `GroupApplication` uses `userId` to reference the applying user
- Earlier versions may have used `applicantId` instead
- The frontend code refers to this relationship as `applicant`

```prisma
model GroupApplication {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  // ...other fields
}
```

## Schema Migration Best Practices

When making schema changes:

1. **Update all environments**: Make sure both development (SQLite) and production (PostgreSQL) schemas are updated consistently
   - Update both `schema.sqlite.prisma` and `schema.postgresql.prisma`
   - Run `switch-to-prod.ps1` before deploying to production

2. **Rename fields consistently**: If renaming fields:
   - Search for all usages with `grep_search` or VS Code search
   - Update all API routes that reference the field
   - Either update frontend code or add field transformations in API responses

3. **Use transitions**: When making breaking changes:
   - Add a transformation layer in the API to maintain backward compatibility
   - Example: mapping `user` to `applicant` in API responses

4. **Test before deployment**: 
   - Test with the PostgreSQL database locally before deploying
   - Use `npm run use:prod` to switch to the PostgreSQL schema
   - Check for errors in routes that use the changed models

## Helpful Testing Commands

```powershell
# Switch to production schema
npm run use:prod

# Generate client for production schema
npx prisma generate

# Create a migration for the production schema
npx prisma migrate dev --name my_change

# Test the API routes with production schema
npm run dev
```

## Known Issues and Their Fixes

1. **GroupMember model issue**: See [GROUP-MEMBER-FIX.md](./GROUP-MEMBER-FIX.md)
   - Problem: Code referenced non-existent `groupMember` model
   - Fix: Updated code to use `user.update({ groupId: ... })` instead

2. **applicantId vs userId issue**: See [GROUP-APPLICATION-FIX.md](./GROUP-APPLICATION-FIX.md)
   - Problem: Code used `applicantId` but schema used `userId`
   - Fix: Updated API routes to use correct field name and added transformation for frontend
