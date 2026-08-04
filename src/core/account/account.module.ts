import { Module } from '@nestjs/common';
import { PrismaModule } from '../infrastructure/prisma.module';
import { REPOSITORY_TOKEN } from 'src/common/constants/repository.config';
import { PrismaAccountRepository } from './infrastructure/prisma-account.repository';
import { CreateAccountUsecase } from './application/usecases/create-account.usecase';
import { AccountController } from './presentation/account.controller';
import { GetAccountListUsecase } from './application/usecases/get-account-list.usecase';
import { GetAccountWithTransactionsUsecase } from './application/usecases/get-by-id.usecase';

@Module({
  imports: [PrismaModule],
  controllers: [AccountController],
  providers: [
    CreateAccountUsecase,
    GetAccountListUsecase,
    GetAccountWithTransactionsUsecase,
    { provide: REPOSITORY_TOKEN.ACCOUNT, useClass: PrismaAccountRepository },
  ],
})
export class AccountModule {}
