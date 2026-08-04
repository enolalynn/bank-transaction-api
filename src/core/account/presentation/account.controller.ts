import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateAccountUsecase } from '../application/usecases/create-account.usecase';
import { CreateAccountDto } from '../application/dtos/create-account.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAccountWithTransactionsUsecase } from '../application/usecases/get-by-id.usecase';
import { GetAccountListUsecase } from '../application/usecases/get-account-list.usecase';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(
    private readonly createAccUC: CreateAccountUsecase,
    private readonly getOneUC: GetAccountWithTransactionsUsecase,
    private readonly getListUC: GetAccountListUsecase,
  ) {}

  @ApiOperation({ summary: 'User account registeration.' })
  @Post()
  async register(@Body() dto: CreateAccountDto) {
    return this.createAccUC.execute(dto);
  }

  @ApiOperation({ summary: 'Get account included transactions.' })
  @Get(':id')
  async getAccount(@Param('id') id: string) {
    return await this.getOneUC.execute(id);
  }

  @ApiOperation({ summary: 'Get all accounts' })
  @Get()
  async getList() {
    return await this.getListUC.execute();
  }
}
