import { Body, Controller, Post } from '@nestjs/common';
import { CreateBankTransferUsecase } from '../application/usecases/create-bank-transfer.usecase';
import { ApiTags } from '@nestjs/swagger';
import { CreateBankTransactionDto } from '../application/dtos/create-bank-transaction.dto';

@ApiTags('bank-transfer')
@Controller('bank-transfer')
export class BankTransferController {
  constructor(private readonly createBankTransUC: CreateBankTransferUsecase) {}
  @Post()
  async save(@Body() dto: CreateBankTransactionDto) {
    return await this.createBankTransUC.execute(dto);
  }
}
