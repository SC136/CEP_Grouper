# GroupMember Model Error Fix

## Previous Issue

The application was encountering the following error during Vercel deployment when creating a group:

```
Error creating group: TypeError: Cannot read properties of undefined (reading 'create')
    at <unknown> (.next/server/app/api/groups/create/route.js:1:1090)
    at async c (.next/server/app/api/groups/create/route.js:1:968)
```

## Root Cause

The error occurred because the codebase was trying to use a `GroupMember` model that doesn't exist in the PostgreSQL schema. 

In the current schema, the relationship between users and groups is modeled directly with a `groupId` field on the `User` model, rather than through a separate join table. 

However, the API code was still written as if a separate `GroupMember` model existed, causing the error when trying to call `tx.groupMember.create()`.

## Files Fixed

The following files were updated to use the correct schema model:

1. `src/app/api/groups/create/route.ts` 
   - Updated to use `user.update` instead of `groupMember.create`

2. `src/app/api/groups/available/route.ts`
   - Updated to query `User` model instead of `GroupMember` model

3. `src/app/api/groups/leave/route.ts`
   - Updated to use `user.update` instead of `groupMember.delete`
   - Updated member queries from `groupMember` to direct `user` queries

4. `src/app/api/groups/current/route.ts`
   - Updated to query user's group through the `groupId` relation

5. `src/app/api/groups/applications/process/route.ts`
   - Updated member counting query from `groupMember.count` to `user.count`
   - Changed approved application handling to update `user.groupId`

6. `src/app/api/groups/apply/route.ts`
   - Updated member check from querying `groupMember` to `user`

## Implementation Notes

The fix maintains the same business logic but updates the queries to match the database schema structure. The direct relationship model (with `groupId` field on the `User` model) is simpler but requires different query patterns than a join table model.
