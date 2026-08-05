import { Inject, Injectable, Logger } from '@nestjs/common';
import { REPOSITORY_TOKEN } from 'src/common/constants/repository.config';
import { IBankTransferRepository } from '../../domain/repository/bank-transfer.repository';

@Injectable()
export class ReconcileLedgerUsecase {
  private readonly logger = new Logger(ReconcileLedgerUsecase.name);
  constructor(
    @Inject(REPOSITORY_TOKEN.BANK_TRANSFER)
    private readonly transactionRepo: IBankTransferRepository,
  ) {}
  async execute(): Promise<void> {
    this.logger.log('Starting nightly bank ledger reconciliation job......');
    const discrepencies = await this.transactionRepo.reconcileAllAccounts();
    if (discrepencies.length === 0) {
      this.logger.log(
        'Reconciliation successfully complete. No discrepency found',
      );
      return;
    }
    this.logger.error(
      `ALERT: Found ${discrepencies.length} account balance discrepencies!`,
    );
    for (const d of discrepencies) {
      this.logger.error(
        `Account ID: ${d.accountId} | snapshot : ${d.snapshotBalance} | Ledger Sum : ${d.ledgerBalance} | Discrepency: ${d.difference}`,
      );
    }
  }
}
