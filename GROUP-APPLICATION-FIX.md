# GroupApplication Schema Fix

## Previous Issue

The application was encountering the following error when attempting to list available groups:

```
Error [PrismaClientValidationError]: 
Invalid `prisma.groupApplication.findMany()` invocation:

{
  where: {
    applicantId: "478669b4-8f28-4384-b77f-06564b6e5247",
    ~~~~~~~~~~~
    status: "PENDING",
    ...
  }
}

Unknown argument `applicantId`. Available options are marked with ?.
```

## Root Cause

The error occurred because the API code was using `applicantId` as a field name when querying the `GroupApplication` model, but according to the PostgreSQL schema, the field is named `userId`.

This mismatch likely happened during schema migration or refactoring. The local development SQLite schema may have used `applicantId` while the production PostgreSQL schema uses `userId`.

## Files Fixed

The following files were updated to use the correct field name:

1. `src/app/api/groups/available/route.ts` 
   - Updated to use `userId` instead of `applicantId`

2. `src/app/api/groups/apply/route.ts`
   - Updated all references from `applicantId` to `userId`

3. `src/app/api/groups/applications/history/route.ts`
   - Updated to use `userId` instead of `applicantId`

## Implementation Notes

The fix maintains the same business logic but updates the field references to match the actual database schema structure. These changes will allow the application to properly query the GroupApplication table.

## Related Files

The migration from SQLite to PostgreSQL appears to have changed the field name from `applicantId` to `userId`. This can be seen in:

- Old schema (SQLite): Used `applicantId` in the migrations
- New schema (PostgreSQL): Uses `userId` as seen in the current schema.prisma
