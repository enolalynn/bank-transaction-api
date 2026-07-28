import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKEN } from 'src/common/constants/repository.config';
import type { IBankTransferRepository } from '../../domain/repository/bank-transfer.repository';
import { BankTransferMapper } from '../mapper/bank-transfer.mapper';

@Injectable()
export class GetOneBankTransactionUsecase {
  constructor(
    @Inject(REPOSITORY_TOKEN.BANK_TRANSFER)
    private readonly transactionRepo: IBankTransferRepository,
  ) {}
  async execute(id: string) {
    const getOne = await this.transactionRepo.findById(id);
    return getOne ? BankTransferMapper.toResponse(getOne) : null;
  }
}
