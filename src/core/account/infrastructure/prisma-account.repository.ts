import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/infrastructure/prisma/prisma.service';
import { IAccountRepository } from '../domain/repositories/account.repository';
import { AccountEntity } from '../domain/entities/account.entity';
import { AccountMapper } from '../application/mapper/account.mapper';

@Injectable()
export class PrismaAccountRepository implements IAccountRepository {
  constructor(private readonly prisma: PrismaService) {}
  async getById(accountId: string): Promise<AccountEntity | null> {
    const acc = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: {
        sentTransaction: { include: { sender: true } },
        receivedTransaction: { include: { receiver: true } },
      },
    });
    return acc ? AccountMapper.toDomain(acc) : null;
  }
  async getAccountList(): Promise<AccountEntity[]> {
    const accounts = await this.prisma.account.findMany({
      include: { sentTransaction: true, receivedTransaction: true },
    });
    return accounts.map((acc) => AccountMapper.toDomain(acc));
  }
  async existsByNrcOrPhoneOrEmail(
    nrc: string,
    phone: string,
    email: string,
  ): Promise<boolean> {
    const exist = await this.prisma.account.count({
      where: { OR: [{ nrcNo: nrc }, { phoneNo: phone }, { email: email }] },
    });
    return exist > 0;
  }
  async save(account: AccountEntity): Promise<AccountEntity> {
    const rawData = AccountMapper.toPersistence(account);
    const created = await this.prisma.account.create({ data: rawData });
    return AccountMapper.toDomain(created);
  }
}
