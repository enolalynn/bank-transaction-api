import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REPOSITORY_TOKEN } from 'src/common/constants/repository.config';
import { IBankTransferRepository } from '../../domain/repository/bank-transfer.repository';
import { PrismaService } from 'src/core/infrastructure/prisma/prisma.service';
import { AccountBalanceResponseDto } from '../dtos/account-balance-reponse.dto';

@Injectable()
export class GetAccountBalanceUsecase {
  constructor(
    @Inject(REPOSITORY_TOKEN.BANK_TRANSFER)
    private readonly txRepo: IBankTransferRepository,
    private readonly prisma: PrismaService,
  ) {}
  async execute(accountId: string): Promise<AccountBalanceResponseDto> {
    const acc = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    if (!acc) {
      throw new NotFoundException({
        code: 'ACCOUNT_NOT_FOUND',
        message: `Account with ID ${accountId} not found!`,
      });
    }
    const balance = await this.txRepo.getAccountBalanceSnapshot(accountId);
    return {
      accountId: acc.id,
      ownerName: acc.ownerName,
      balance,
      status: acc.status,
    };
  }
}
