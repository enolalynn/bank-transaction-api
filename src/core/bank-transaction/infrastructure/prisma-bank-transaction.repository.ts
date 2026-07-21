/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IBankTransferRepository } from '../domain/repository/bank-transfer.repository';
import { BankTransfer } from '../domain/entities/bank-transfer.entity';
import { PrismaService } from 'src/core/infrastructure/prisma.service';
import { Money } from '../domain/entities/money.vo';

@Injectable()
export class PrismaBankTransferRepository implements IBankTransferRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findById(id: string): Promise<BankTransfer | null> {
    const find = await this.prisma.bankTransaction.findUnique({
      where: { id },
      include: { receiver: true, sender: true },
    });
    return this.toDomain(find);
  }

  async findAll(): Promise<BankTransfer[]> {
    const findAll = await this.prisma.bankTransaction.findMany({
      include: {
        sender: true,
        receiver: true,
      },
    });
    return findAll.map((item) => this.toDomain(item));
  }

  async bankTransfer(transfer: BankTransfer): Promise<BankTransfer> {
    const { senderId, receiverId, amount } = transfer.toPrimitives();

    try {
      return await this.prisma.$transaction(async (tx) => {
        const updateSender = await tx.account.updateMany({
          where: { id: senderId, balance: { gte: amount } },
          data: { balance: { decrement: amount } },
        });

        if (updateSender.count === 0) {
          throw new BadRequestException('INSUFFICIENT_FUNDS');
        }

        const updateReceiver = await tx.account.updateMany({
          where: { id: receiverId },
          data: { balance: { increment: amount } },
        });

        if (updateReceiver.count === 0) {
          throw new NotFoundException('RECEIVER_NOT_FOUND');
        }

        transfer.markAsCompleted();

        const record = await tx.bankTransaction.create({
          data: {
            senderId,
            receiverId,
            amount,
            status: transfer.toPrimitives().status,
          },
          select: {
            id: true,
            createdAt: true,
            sender: true,
            receiver: true,
            amount: true,
            status: true,
          },
        });

        return BankTransfer.reconstitute({
          id: record.id,
          amount: Money.fromDecimal(Number(record.amount)),
          senderId: record.sender.id,
          senderName: record.sender.ownerName,
          receiverId: record.receiver.id,
          receiverName: record.receiver.ownerName,
          status: record.status,
          createdAt: record.createdAt,
        });
      });
    } catch (error) {
      transfer.markAsFailed();

      await this.prisma.bankTransaction.create({
        data: {
          senderId,
          receiverId,
          amount,
          status: transfer.toPrimitives().status,
        },
      });

      throw error;
    }
  }

  private toDomain(record: any): BankTransfer {
    if (!record) {
      throw new Error(
        'Cannot map null or undefined record to BankTransfer domain entity',
      );
    }
    return BankTransfer.reconstitute({
      id: record.id,
      amount: Money.fromDecimal(Number(record.amount)),
      senderId: record.senderId ?? record.sender?.id,
      senderName: record.sender?.ownerName ?? null,
      receiverId: record.receiverId ?? record.receiver?.id,
      receiverName: record.receiver?.ownerName ?? null,
      status: record.status,
      createdAt: record.createdAt,
    });
  }
}
