/*
  Warnings:

  - Added the required column `balanceAfter` to the `LedgerEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "balance" DECIMAL(20,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "LedgerEntry" ADD COLUMN     "balanceAfter" DECIMAL(20,2) NOT NULL;
