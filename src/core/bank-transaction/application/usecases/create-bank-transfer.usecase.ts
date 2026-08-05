import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKEN } from 'src/common/constants/repository.config';
import { IBankTransferRepository } from '../../domain/repository/bank-transfer.repository';
import { BankTransfer } from '../../domain/entities/bank-transfer.entity';
import { CreateBankTransactionDto } from '../dtos/create-bank-transaction.dto';
import { BankTransferMapper } from '../mapper/bank-transfer.mapper';
import { BankTransactionResponse } from '../dtos/bank-tansfer-response.dto';
import { Money } from '../../domain/entities/money.vo';
import { DomainException } from 'src/common/exceptions/domain.exception';

@Injectable()
export class CreateBankTransferUsecase {
  constructor(
    @Inject(REPOSITORY_TOKEN.BANK_TRANSFER)
    private readonly bankTransferRepo: IBankTransferRepository,
  ) {}
  async execute(
    dto: CreateBankTransactionDto,
    idempotencyKey?: string,
  ): Promise<BankTransactionResponse> {
    try {
      const amount = Money.fromDecimal(dto.amount);
      const transferEntity = BankTransfer.create({
        senderId: dto.senderId,
        receiverId: dto.receiverId,
        amount,
      });
      const saved = await this.bankTransferRepo.bankTransfer(
        transferEntity,
        idempotencyKey,
      );

      return BankTransferMapper.toResponse(saved);
    } catch (error) {
      if (error instanceof DomainException) {
        throw new BadRequestException({
          code: error.code,
          message: error.message,
        });
      }
      throw error;
    }
  }
}
