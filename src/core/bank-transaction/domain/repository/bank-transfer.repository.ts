import { BankTransfer } from '../entities/bank-transfer.entity';
import { Prisma } from '@prisma/client';
export interface IBankTransferRepository {
  bankTransfer(
    tranfer: BankTransfer,
    tx?: Prisma.TransactionClient,
  ): Promise<BankTransfer>;

  findById(id: string): Promise<BankTransfer | null>;
  findAll(): Promise<BankTransfer[] | null>;
}
