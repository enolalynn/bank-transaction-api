import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CreateBankTransferUsecase } from '../application/usecases/create-bank-transfer.usecase';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBankTransactionDto } from '../application/dtos/create-bank-transaction.dto';
import { BankTransferListUsecase } from '../application/usecases/bank-transfer-list.usecase';
import { GetOneBankTransactionUsecase } from '../application/usecases/get-one-transaction.usecase';

@ApiTags('bank-transfer')
@Controller('bank-transfer')
export class BankTransferController {
  constructor(
    private readonly createBankTransUC: CreateBankTransferUsecase,
    private readonly listUC: BankTransferListUsecase,
    private readonly getOneUC: GetOneBankTransactionUsecase,
  ) {}
  @ApiOperation({ description: 'Bank Transfer Process' })
  @HttpCode(HttpStatus.OK)
  @Post()
  async save(@Body() dto: CreateBankTransactionDto) {
    return await this.createBankTransUC.execute(dto);
  }

  @ApiOperation({ description: 'Bank transaction history by tx Id' })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.getOneUC.execute(id);
  }

  @ApiOperation({ description: 'Bank Transfer History' })
  @HttpCode(HttpStatus.OK)
  @Get()
  async list() {
    return await this.listUC.execute();
  }
}
