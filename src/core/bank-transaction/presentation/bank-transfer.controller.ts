import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CreateBankTransferUsecase } from '../application/usecases/create-bank-transfer.usecase';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateBankTransactionDto } from '../application/dtos/create-bank-transaction.dto';
import { BankTransferListUsecase } from '../application/usecases/bank-transfer-list.usecase';
import { GetOneBankTransactionUsecase } from '../application/usecases/get-one-transaction.usecase';
import { BankTransactionResponse } from '../application/dtos/bank-tansfer-response.dto';
import { GetAccountBalanceUsecase } from '../application/usecases/get-account-balance.usecase';
import { ReconcileLedgerUsecase } from '../application/usecases/reconcile-ledger.usecase';
import { GetPendingOutboxEventsUsecase } from '../application/usecases/get-pending-outbox-events.usecase';
import { RetryFailedEventsUsecase } from '../application/usecases/retry-failed-events.usecase';

@ApiTags('Bank Transaction')
@Controller()
export class BankTransferController {
  constructor(
    private readonly createBankTransUC: CreateBankTransferUsecase,
    private readonly listUC: BankTransferListUsecase,
    private readonly getOneUC: GetOneBankTransactionUsecase,
    private readonly getBalanceUC: GetAccountBalanceUsecase,
    private readonly reconciliationUC: ReconcileLedgerUsecase,
    private readonly pendingEventsUC: GetPendingOutboxEventsUsecase,
    private readonly retryUC: RetryFailedEventsUsecase,
  ) {}
  @ApiOperation({ description: 'Bank Transfer Process' })
  @HttpCode(HttpStatus.CREATED)
  @ApiHeader({
    name: 'x-idempotency-key',
    description: 'Unique UUID v4 to prevent duplicate transfers',
    required: false,
  })
  @Post('bank-transfer')
  async save(
    @Body() dto: CreateBankTransactionDto,
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ): Promise<BankTransactionResponse> {
    return await this.createBankTransUC.execute(dto, idempotencyKey);
  }

  @ApiOperation({ description: 'Bank transaction history by tx Id' })
  @HttpCode(HttpStatus.OK)
  @Get('bank-transfer/:id')
  async getOne(@Param('id') id: string) {
    return await this.getOneUC.execute(id);
  }

  @ApiOperation({ description: 'Bank Transfer History' })
  @HttpCode(HttpStatus.OK)
  @Get('bank-transfer')
  async list() {
    return await this.listUC.execute();
  }

  @Get('accounts/:id/balance')
  @HttpCode(HttpStatus.OK)
  async getBalance(@Param('id') accountId: string) {
    return await this.getBalanceUC.execute(accountId);
  }

  @Post('bank-transfer/reconcile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Trigger manual nightly ledger reconciliation audit',
  })
  @ApiResponse({ status: 200, description: 'Reconciliation process completed' })
  async triggerReconciliation(): Promise<{ message: string }> {
    await this.reconciliationUC.execute();
    return { message: 'Reconciliation audit successfully complete...!' };
  }

  @ApiOperation({ summary: 'View pending/failed outbox event queued.' })
  @Get('bank-transfer/outbox/pending')
  async getPendingOutboxEvents() {
    return this.pendingEventsUC.execute();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Manually trigger retry for a failed outbox event' })
  @Post('bank-transfer/outbox/:id/retry')
  async retryEvents(@Param('id') id: string) {
    return await this.retryUC.execute(id);
  }
}
