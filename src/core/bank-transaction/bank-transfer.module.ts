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
import { OutboxProcessorService } from '../infrastructure/outbox/outbox-processor.service';
import { GetPendingOutboxEventsUsecase } from './application/usecases/get-pending-outbox-events.usecase';
import { RetryFailedEventsUsecase } from './application/usecases/retry-failed-events.usecase';
import { UploadKycUsecase } from './application/usecases/upload-kyc.usecase';
import { StorageModule } from '../infrastructure/storage.module';
import { AccountStatementService } from './application/services/statement.service';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [BankTransferController],
  providers: [
    CreateBankTransferUsecase,
    BankTransferListUsecase,
    GetOneBankTransactionUsecase,
    ReconcileLedgerUsecase,
    GetAccountBalanceUsecase,
    OutboxProcessorService,
    GetPendingOutboxEventsUsecase,
    RetryFailedEventsUsecase,
    UploadKycUsecase,
    AccountStatementService,
    {
      provide: REPOSITORY_TOKEN.BANK_TRANSFER,
      useClass: PrismaBankTransferRepository,
    },
  ],
})
export class BankTransferModule {}
