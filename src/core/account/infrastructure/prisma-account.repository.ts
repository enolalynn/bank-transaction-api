import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/infrastructure/prisma/prisma.service';
import { IAccountRepository } from '../domain/repositories/account.repository';
import { AccountEntity } from '../domain/entities/account.entity';

@Injectable()
export class PrismaAccountRepository implements IAccountRepository {
  constructor(private readonly prisma: PrismaService) {}
  existsByNrcOrPhoneOrEmail(
    nrc: string,
    phone: string,
    email: string,
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  save(account: AccountEntity): Promise<AccountEntity> {
    throw new Error('Method not implemented.');
  }
}
