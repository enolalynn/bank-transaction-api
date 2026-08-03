/*
  Warnings:

  - A unique constraint covering the columns `[phoneNo]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNo` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phoneNo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OutboxEvent" ALTER COLUMN "processedAt" DROP NOT NULL;

-- CreateTable
CREATE TABLE "KycDocument" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "status" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KycDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KycDocument_accountId_idx" ON "KycDocument"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_phoneNo_key" ON "Account"("phoneNo");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- AddForeignKey
ALTER TABLE "KycDocument" ADD CONSTRAINT "KycDocument_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
