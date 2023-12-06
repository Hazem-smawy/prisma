/*
  Warnings:

  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tokens" TEXT;

-- DropTable
DROP TABLE "Token";

-- DropEnum
DROP TYPE "TokenType";
