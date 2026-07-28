import { Module } from '@nestjs/common';
import { PrismaModule } from '../infrastructure/prisma.module';
import { REPOSITORY_TOKEN } from 'src/common/constants/repository.config';
import { PrismaBankTransferRepository } from './infrastructure/prisma-bank-transaction.repository';
import { CreateBankTransferUsecase } from './application/usecases/create-bank-transfer.usecase';
import { BankTransferController } from './presentation/bank-transfer.controller';
import { BankTransferListUsecase } from './application/usecases/bank-transfer-list.usecase';
import { GetOneBankTransactionUsecase } from './application/usecases/get-one-transaction.usecase';
import { ReconcileLedgerUsecase } from './application/usecases/reconcile-ledger.usecase';
import { GetAccountBalanceUsecase } from './application/usecases/get-account-balance.usecase';

@Module({
  imports: [PrismaModule],
  controllers: [BankTransferController],
  providers: [
    CreateBankTransferUsecase,
    BankTransferListUsecase,
    GetOneBankTransactionUsecase,
    ReconcileLedgerUsecase,
    GetAccountBalanceUsecase,
    {
      provide: REPOSITORY_TOKEN.BANK_TRANSFER,
      useClass: PrismaBankTransferRepository,
    },
  ],
})
export class BankTransferModule {}
