/*
  Warnings:

  - Changed the type of `createdAt` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `updatedAt` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
ADD COLUMN     "createdAt" BIGINT NOT NULL,
DROP COLUMN "updatedAt",
ADD COLUMN     "updatedAt" BIGINT NOT NULL;
