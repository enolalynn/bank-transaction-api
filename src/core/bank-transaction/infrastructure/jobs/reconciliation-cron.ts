import { Injectable } from '@nestjs/common';
import { ReconcileLedgerUsecase } from '../../application/usecases/reconcile-ledger.usecase';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ReconciliationCronJob {
  constructor(private readonly reconciliationUC: ReconcileLedgerUsecase) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleNightlyReconciliation() {
    await this.reconciliationUC.execute();
  }
}
