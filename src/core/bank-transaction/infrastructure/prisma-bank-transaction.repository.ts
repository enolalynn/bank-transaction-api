/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IBankTransferRepository,
  ReconciliationDiscrepancy,
} from '../domain/repository/bank-transfer.repository';
import { BankTransfer } from '../domain/entities/bank-transfer.entity';
import { PrismaService } from 'src/core/infrastructure/prisma/prisma.service';
import { Money } from '../domain/entities/money.vo';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { AccountEntity } from '../domain/entities/account.entity';
import { AccountStatementAggregate } from '../domain/aggregates/account-statement.aggregate';
import { AccountStatementMapper } from '../application/mapper/account-statement.mapper';

const accountWithTransactionsInclude =
  Prisma.validator<Prisma.AccountDefaultArgs>()({
    include: {
      ledgerEntries: {
        include: { transaction: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

export type AccountWithTransactionsRaw = Prisma.AccountGetPayload<
  typeof accountWithTransactionsInclude
>;

@Injectable()
export class PrismaBankTransferRepository implements IBankTransferRepository {
  constructor(private readonly prisma: PrismaService) {}
  async getAccountWithTransaction(
    accountId: string,
  ): Promise<AccountStatementAggregate> {
    const acc = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: accountWithTransactionsInclude.include,
    });
    if (!acc)
      throw new NotFoundException({
        code: 'ACCOUNT_NOT_FOUND',
        message: 'Account not found',
      });
    return AccountStatementMapper.toDomain(acc);
  }

  async getAccountBalanceSnapshot(accountId: string): Promise<number> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      select: { balance: true },
    });
    return account ? Number(account.balance) : 0;
  }

  async reconcileAllAccounts(): Promise<ReconciliationDiscrepancy[]> {
    const accounts = await this.prisma.account.findMany({
      select: { id: true, balance: true },
    });
    const discrepencies: ReconciliationDiscrepancy[] = [];
    for (const acc of accounts) {
      const snapshotBalance = Number(acc.balance);
      const ledgerSumResult = await this.prisma.ledgerEntry.aggregate({
        where: { accountId: acc.id },
        _sum: { amount: true },
      });
      const ledgerBalance = ledgerSumResult._sum.amount
        ? Number(ledgerSumResult._sum.amount)
        : 0;
      if (Math.abs(snapshotBalance - ledgerBalance) > 0.001) {
        discrepencies.push({
          accountId: acc.id,
          snapshotBalance,
          ledgerBalance,
          difference: snapshotBalance - ledgerBalance,
        });
      }
    }
    return discrepencies;
  }

  async findById(id: string): Promise<BankTransfer | null> {
    const find = await this.prisma.bankTransaction.findUnique({
      where: { id },
      include: { receiver: true, sender: true },
    });
    return this.toDomain(find);
  }

  async findAll(): Promise<BankTransfer[]> {
    const findAll = await this.prisma.bankTransaction.findMany({
      include: {
        sender: true,
        receiver: true,
      },
    });
    return findAll.map((item) => this.toDomain(item));
  }

  async bankTransfer(
    transfer: BankTransfer,
    idempotencyKey?: string,
  ): Promise<BankTransfer> {
    const { senderId, receiverId, amount } = transfer.toPrimitives();
    const transferMoney = Money.fromDecimal(amount);

    return await this.prisma.$transaction(
      async (tx) => {
        const sortedIds = [senderId, receiverId].sort();
        const rawAccounts = await tx.$queryRaw<
          Array<{
            id: string;
            ownerName: string;
            nrcNo: string;
            balance: Decimal;
            status: string;
          }>
        >`SELECT id,"ownerName","nrcNo", balance, status FROM "Account" WHERE id IN (${Prisma.join(sortedIds)}) ORDER BY id ASC FOR UPDATE`;

        if (rawAccounts.length < 2) {
          throw new NotFoundException({
            code: 'ACCOUNT_NOT_FOUND',
            message: 'One or both accounts do not exist',
          });
        }

        const senderRaw = rawAccounts.find((a) => a.id === senderId)!;
        const receiverRaw = rawAccounts.find((a) => a.id === receiverId)!;

        const senderAccount = AccountEntity.reconstitute({
          id: senderRaw.id,
          ownerName: senderRaw.ownerName,
          nrcNo: senderRaw.nrcNo,
          balance: Money.fromDecimal(Number(senderRaw.balance)),
          status: senderRaw.status as any,
        });
        const receiverAccount = AccountEntity.reconstitute({
          id: receiverRaw.id,
          ownerName: receiverRaw.ownerName,
          nrcNo: receiverRaw.nrcNo,
          balance: Money.fromDecimal(Number(receiverRaw.balance)),
          status: receiverRaw.status as any,
        });
        senderAccount.debit(transferMoney);
        receiverAccount.credit(transferMoney);
        transfer.markAsCompleted();

        const transactionRecord = await tx.bankTransaction.create({
          data: {
            senderId,
            receiverId,
            amount,
            status: transfer.toPrimitives().status,
            idempotencyKey,
          },
        });
        await tx.account.update({
          where: { id: senderId },
          data: { balance: senderAccount.balance.toDecimal() },
        });
        await tx.account.update({
          where: { id: receiverId },
          data: { balance: receiverAccount.balance.toDecimal() },
        });

        await tx.ledgerEntry.createMany({
          data: [
            {
              accountId: senderId,
              transactionId: transactionRecord.id,
              amount: amount,
              type: 'DEBIT',
              balanceAfter: senderAccount.balance.toDecimal(),
            },
            {
              accountId: receiverId,
              transactionId: transactionRecord.id,
              type: 'CREDIT',
              amount: amount,
              balanceAfter: receiverAccount.balance.toDecimal(),
            },
          ],
        });

        await tx.outboxEvent.create({
          data: {
            aggregateType: 'BANK_TRANSFER',
            aggregateId: transactionRecord.id,
            eventType: 'TRANSFER_COMPLETED',
            payload: {
              transactionId: transactionRecord.id,
              senderId,
              receiverId,
              amount,
              completedAt: new Date().toISOString(),
            },
            processedAt: null,
          },
        });
        return BankTransfer.reconstitute({
          id: transactionRecord.id,
          amount: Money.fromDecimal(Number(transactionRecord.amount)),
          senderId: senderId,
          senderName: senderAccount.ownerName,
          receiverId: receiverId,
          receiverName: receiverAccount.ownerName,
          status: transactionRecord.status,
          createdAt: transactionRecord.createdAt,
        });
      },
      { timeout: 10000 },
    );
  }

  private toDomain(record: any): BankTransfer {
    if (!record) {
      throw new Error(
        'Cannot map null or undefined record to BankTransfer domain entity',
      );
    }
    return BankTransfer.reconstitute({
      id: record.id,
      amount: Money.fromDecimal(Number(record.amount)),
      senderId: record.senderId ?? record.sender?.id,
      senderName: record.sender?.ownerName ?? null,
      receiverId: record.receiverId ?? record.receiver?.id,
      receiverName: record.receiver?.ownerName ?? null,
      status: record.status,
      createdAt: record.createdAt,
    });
  }
}
