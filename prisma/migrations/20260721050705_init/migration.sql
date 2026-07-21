/*
  Warnings:

  - You are about to drop the column `Amount` on the `BankTransaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BankTransaction" DROP COLUMN "Amount",
ADD COLUMN     "amount" DECIMAL(65,30) NOT NULL DEFAULT 0.0;
