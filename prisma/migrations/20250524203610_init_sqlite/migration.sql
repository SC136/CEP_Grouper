/*
  Warnings:

  - You are about to drop the `GroupMember` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `ClassRollRange` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ClassRollRange` table. All the data in the column will be lost.
  - You are about to drop the column `applicantId` on the `GroupApplication` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[adminId]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `GroupApplication` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Group_name_key";

-- DropIndex
DROP INDEX "GroupMember_userId_groupId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GroupMember";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ClassRollRange" (
    "className" TEXT NOT NULL PRIMARY KEY,
    "minRoll" INTEGER NOT NULL,
    "maxRoll" INTEGER NOT NULL
);
INSERT INTO "new_ClassRollRange" ("className", "maxRoll", "minRoll") SELECT "className", "maxRoll", "minRoll" FROM "ClassRollRange";
DROP TABLE "ClassRollRange";
ALTER TABLE "new_ClassRollRange" RENAME TO "ClassRollRange";
CREATE TABLE "new_GroupApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "responseNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GroupApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GroupApplication_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GroupApplication" ("createdAt", "groupId", "id", "notes", "responseNote", "status", "updatedAt") SELECT "createdAt", "groupId", "id", "notes", "responseNote", "status", "updatedAt" FROM "GroupApplication";
DROP TABLE "GroupApplication";
ALTER TABLE "new_GroupApplication" RENAME TO "GroupApplication";
CREATE INDEX "GroupApplication_groupId_idx" ON "GroupApplication"("groupId");
CREATE INDEX "GroupApplication_userId_idx" ON "GroupApplication"("userId");
CREATE UNIQUE INDEX "GroupApplication_userId_groupId_key" ON "GroupApplication"("userId", "groupId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rollNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "groupId" TEXT,
    CONSTRAINT "User_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "id", "name", "password", "rollNumber", "updatedAt") SELECT "createdAt", "id", "name", "password", "rollNumber", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_rollNumber_key" ON "User"("rollNumber");
CREATE INDEX "User_groupId_idx" ON "User"("groupId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Group_adminId_key" ON "Group"("adminId");
