import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKEN } from 'src/common/constants/repository.config';
import { IAccountRepository } from '../../domain/repositories/account.repository';
import { AccountResponseDto } from '../dtos/account-response.dto';

@Injectable()
export class GetAccountListUsecase {
  constructor(
    @Inject(REPOSITORY_TOKEN.ACCOUNT)
    private readonly accountRepo: IAccountRepository,
  ) {}
  async execute(): Promise<AccountResponseDto[]> {
    const list = await this.accountRepo.getAccountList();
    return list.map((l) => ({
      id: l.id!,
      ownerName: l.ownerName,
      nrcNo: l.nrcNo.value,
      phoneNo: l.phoneNo.value,
      email: l.email.value,
      balance: l.balance,
      status: l.status,
      createdAt: l.createdAt,
    }));
  }
}
