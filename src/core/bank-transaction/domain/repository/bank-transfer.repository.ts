import { BankTransfer } from '../entities/bank-transfer.entity';
export interface ReconciliationDiscrepancy {
  accountId: string;
  snapshotBalance: number;
  ledgerBalance: number;
  difference: number;
}

export interface IBankTransferRepository {
  bankTransfer(
    tranfer: BankTransfer,
    idempotencyKey?: string,
  ): Promise<BankTransfer>;
  findById(id: string): Promise<BankTransfer | null>;
  findAll(): Promise<BankTransfer[] | null>;
  getAccountBalanceSnapshot(accountId: string): Promise<number>;
  reconcileAllAccounts(): Promise<ReconciliationDiscrepancy[]>;
}
