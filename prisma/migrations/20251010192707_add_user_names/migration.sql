/*
  Warnings:

  - Added the required column `firstName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable - Add columns with temporary defaults for existing rows
ALTER TABLE "users" ADD COLUMN "firstName" TEXT NOT NULL DEFAULT 'Unknown';
ALTER TABLE "users" ADD COLUMN "lastName" TEXT NOT NULL DEFAULT 'User';

-- Remove the default values after adding the columns (new rows will require these fields)
ALTER TABLE "users" ALTER COLUMN "firstName" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "lastName" DROP DEFAULT;
