import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKEN } from 'src/constants/repository.config';
import type { IBankTransferRepository } from '../../domain/repository/bank-transfer.repository';
import { PrismaService } from 'src/core/infrastructure/prisma.service';
import { BankTransfer } from '../../domain/entities/bank-transfer.entity';
import { CreateBankTransactionDto } from '../dtos/create-bank-transaction.dto';
import { Prisma } from '@prisma/client';
import { BankTransferMapper } from '../mapper/bank-transfer.mapper';
import { BankTransactionResponse } from '../dtos/bank-tansfer-response.dto';
import { Money } from '../../domain/entities/money.vo';

@Injectable()
export class CreateBankTransferUsecase {
  constructor(
    @Inject(REPOSITORY_TOKEN.BANK_TRANSFER)
    private readonly bankTransferRepo: IBankTransferRepository,
    private readonly prisma: PrismaService,
  ) {}
  async execute(
    dto: CreateBankTransactionDto,
  ): Promise<BankTransactionResponse> {
    const amount = Money.fromDecimal(dto.amount);
    const transferEntity = BankTransfer.create({
      senderId: dto.senderId,
      receiverId: dto.receiverId,
      amount,
    });
    const saved = await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        return await this.bankTransferRepo.bankTransfer(transferEntity, tx);
      },
    );
    return BankTransferMapper.toResponse(saved);
  }
}
