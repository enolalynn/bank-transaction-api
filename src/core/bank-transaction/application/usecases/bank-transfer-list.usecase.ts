import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKEN } from 'src/common/constants/repository.config';
import { IBankTransferRepository } from '../../domain/repository/bank-transfer.repository';
import { BankTransferMapper } from '../mapper/bank-transfer.mapper';

@Injectable()
export class BankTransferListUsecase {
  constructor(
    @Inject(REPOSITORY_TOKEN.BANK_TRANSFER)
    private readonly bankTransferRepo: IBankTransferRepository,
  ) {}
  async execute() {
    const list = await this.bankTransferRepo.findAll();
    return list
      ? list.map((item) => BankTransferMapper.toResponse(item))
      : null;
  }
}
