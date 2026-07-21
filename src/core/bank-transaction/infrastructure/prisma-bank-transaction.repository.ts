import { Injectable, NotFoundException } from '@nestjs/common';
import { IBankTransferRepository } from '../domain/repository/bank-transfer.repository';
import { BankTransfer } from '../domain/entities/bank-transfer.entity';
import { PrismaService } from 'src/core/infrastructure/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaBankTransferRepository implements IBankTransferRepository {
  constructor(private readonly prisma: PrismaService) {}
  async bankTransfer(
    transfer: BankTransfer,
    tx?: Prisma.TransactionClient,
  ): Promise<BankTransfer> {
    const client = tx || this.prisma;
    const { senderId, receiverId, amount } = transfer.toPrimitives();

    const updateSender = await client.account.updateMany({
      where: { id: senderId, balance: { gte: amount } },
      data: { balance: { decrement: amount } },
    });
    if (updateSender.count === 0)
      throw new NotFoundException('Sender not found');

    const updateReceiver = await client.account.updateMany({
      where: { id: receiverId },
      data: { balance: { increment: amount } },
    });
    if (updateReceiver.count === 0)
      throw new NotFoundException('Receiver not found');

    const record = await client.bankTransaction.create({
      data: {
        senderId,
        receiverId,
        amount,
        status: 'SUCCESS',
      },
    });

    return BankTransfer.reconstitute({
      id: record.id,
      receiverId: record.receiverId,
      senderId: record.senderId,
      amount: Number(record.amount),
      status: record.status as 'SUCCESS',
      createdAt: record.createdAt,
    });
  }
}
