import { BankTransaction, Account as PrismaAccount } from '@prisma/client';
import { AccountEntity } from '../../domain/entities/account.entity';
import { NrcNo } from 'src/common/value-objects/nrc.vo';
import { PhoneNo } from 'src/common/value-objects/phone.vo';
import { Email } from 'src/common/value-objects/email.vo';
import { BankTransfer } from 'src/core/bank-transaction/domain/entities/bank-transfer.entity';
import { Money } from 'src/common/value-objects/money.vo';
import { AccountResponseDto } from '../dtos/account-response.dto';

export type PrismaAccountWithTransactions = PrismaAccount & {
  sentTransaction?: BankTransaction[];
  receivedTransaction?: BankTransaction[];
};
export class AccountMapper {
  public static toDomain(raw: PrismaAccountWithTransactions): AccountEntity {
    const sent = raw.sentTransaction ?? [];
    const received = raw.receivedTransaction ?? [];

    const transactions: BankTransfer[] = [...sent, ...received].map((tx) =>
      BankTransfer.reconstitute({
        id: tx.id,
        amount: Money.fromDecimal(Number(tx.amount)),
        senderId: tx.senderId,
        receiverId: tx.receiverId,
        status: tx.status,
        createdAt: tx.createdAt,
      }),
    );
    transactions.sort((a, b) => {
      const dateA = a.toPrimitives().createdAt?.getTime() ?? 0;
      const dateB = b.toPrimitives().createdAt?.getTime() ?? 0;
      return dateA - dateB;
    });

    return AccountEntity.create({
      id: raw.id,
      ownerName: raw.ownerName,
      nrcNo: NrcNo.create(raw.nrcNo),
      phoneNo: PhoneNo.create(raw.phoneNo),
      email: Email.create(raw.email),
      password: raw.password,
      balance: Number(raw.balance),
      status: raw.status,
      createdAt: raw.createdAt,
      transactions,
    });
  }

  public static toResponseDto(entity: AccountEntity): AccountResponseDto {
    return {
      id: entity.id!,
      ownerName: entity.ownerName,
      nrcNo: entity.nrcNo.value,
      phoneNo: entity.phoneNo.value,
      email: entity.email.value,
      balance: entity.balance,
      status: entity.status,
      createdAt: entity.createdAt,
      transactions:
        entity.transaction?.map((tx) => {
          const primitive = tx.toPrimitives();
          return {
            id: tx.id ?? primitive.id!,
            amount: primitive.amount ?? tx.amount.amountInCent,
            senderId: tx.senderId,
            receiverId: tx.receiverId,
            status: primitive.status ?? 'PENDING',
            createdAt: primitive.createdAt!,
          };
        }) ?? [],
    };
  }

  public static toPersistence(entity: AccountEntity) {
    return {
      ownerName: entity.ownerName,
      nrcNo: entity.nrcNo.value,
      phoneNo: entity.phoneNo.value,
      email: entity.email.value,
      password: entity.password,
      balance: entity.balance,
      status: entity.status,
    };
  }
}
