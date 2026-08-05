import { AccountStatementAggregate } from '../../domain/aggregates/account-statement.aggregate';
import { Money } from '../../domain/entities/money.vo';
import { AccountWithTransactionsRaw } from '../../infrastructure/prisma-bank-transaction.repository';

export class AccountStatementMapper {
  public static toDomain(
    raw: AccountWithTransactionsRaw,
  ): AccountStatementAggregate {
    return AccountStatementAggregate.reconstitude({
      id: raw.id,
      ownerName: raw.ownerName,
      nrcNo: raw.nrcNo,
      balance: Money.fromDecimal(Number(raw.balance)),
      ledgerEntries: raw.ledgerEntries.map((l) => ({
        id: l.id,
        type: l.type,
        amount: Money.fromDecimal(Number(l.amount)),
        balanceAfter: Money.fromDecimal(Number(l.balanceAfter)),
        transactionId: l.transactionId,
        createdAt: l.createdAt,
      })),
    });
  }
}
