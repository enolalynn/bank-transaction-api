import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKEN } from 'src/constants/repository.config';
import type { IBankTransferRepository } from '../../domain/repository/bank-transfer.repository';
import { PrismaService } from 'src/core/infrastructure/prisma.service';
import { BankTransfer } from '../../domain/entities/bank-transfer.entity';
import { CreateBankTransactionDto } from '../dtos/create-bank-transaction.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CreateBankTransferUsecase {
  constructor(
    @Inject(REPOSITORY_TOKEN.BANK_TRANSFER)
    private readonly bankTransferRepo: IBankTransferRepository,
    private readonly prisma: PrismaService,
  ) {}
  async execute(dto: CreateBankTransactionDto) {
    const transferEntity = BankTransfer.create({
      senderId: dto.senderId,
      receiverId: dto.receiverId,
      amount: dto.amount,
    });
    return await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        await this.bankTransferRepo.bankTransfer(transferEntity, tx);
      },
    );
  }
}
