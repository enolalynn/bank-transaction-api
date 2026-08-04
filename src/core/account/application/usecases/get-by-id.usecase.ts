import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKEN } from 'src/common/constants/repository.config';
import { IAccountRepository } from '../../domain/repositories/account.repository';
import { AccountMapper } from '../mapper/account.mapper';

@Injectable()
export class GetAccountWithTransactionsUsecase {
  constructor(
    @Inject(REPOSITORY_TOKEN.ACCOUNT)
    private readonly accountRepo: IAccountRepository,
  ) {}
  async execute(accountId: string) {
    const account = await this.accountRepo.getById(accountId);
    return account ? AccountMapper.toResponseDto(account) : null;
  }
}
