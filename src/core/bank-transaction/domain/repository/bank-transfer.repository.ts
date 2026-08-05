import { AccountStatementAggregate } from '../aggregates/account-statement.aggregate';
import { BankTransfer } from '../entities/bank-transfer.entity';
export interface ReconciliationDiscrepancy {
  accountId: string;
  snapshotBalance: number;
  ledgerBalance: number;
  difference: number;
}

export abstract class IBankTransferRepository {
  abstract bankTransfer(
    tranfer: BankTransfer,
    idempotencyKey?: string,
  ): Promise<BankTransfer>;
  abstract findById(id: string): Promise<BankTransfer | null>;
  abstract findAll(): Promise<BankTransfer[] | null>;
  abstract getAccountBalanceSnapshot(accountId: string): Promise<number>;
  abstract reconcileAllAccounts(): Promise<ReconciliationDiscrepancy[]>;
  abstract getAccountWithTransaction(
    accountId: string,
  ): Promise<AccountStatementAggregate>;
}
