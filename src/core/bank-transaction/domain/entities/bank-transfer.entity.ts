import { TransactionStatus } from '@prisma/client';
import { Money } from './money.vo';
import { InvalidTransferException } from 'src/common/exceptions/domain.exception';

export interface BankTransferProps {
  id?: string;
  amount: Money;
  senderId: string;
  senderName?: string | null;
  receiverId: string;
  receiverName?: string | null;
  status?: TransactionStatus;
  createdAt?: Date;
}
export class BankTransfer {
  constructor(private readonly props: BankTransferProps) {
    this.validate();
  }
  private validate(): void {
    if (this.props.amount.amountInCent <= 0) {
      throw new InvalidTransferException(
        'Transfer amount must be greater than zero',
      );
    }
    if (this.props.senderId === this.props.receiverId) {
      throw new InvalidTransferException(
        'Sender and receiver cannot be the same account',
      );
    }
  }
  public markAsCompleted(): void {
    this.props.status = 'SUCCESS';
  }
  public markAsFailed(): void {
    this.props.status = 'FAILED';
  }
  public static create(props: BankTransferProps): BankTransfer {
    return new BankTransfer({
      ...props,
      status: props.status ?? 'PENDING',
      createdAt: props.createdAt ?? new Date(),
    });
  }
  public static reconstitute(props: BankTransferProps): BankTransfer {
    return new BankTransfer(props);
  }

  get id(): string | undefined {
    return this.props.id;
  }
  get senderId(): string {
    return this.props.senderId;
  }
  get receiverId(): string {
    return this.props.receiverId;
  }
  get amount(): Money {
    return this.props.amount;
  }

  public toPrimitives() {
    return {
      id: this.props.id,
      amount: this.props.amount.toDecimal(),
      senderId: this.props.senderId,
      senderName: this.props.senderName,
      receiverId: this.props.receiverId,
      receiverName: this.props.receiverName,
      status: this.props.status,
      createdAt: this.props.createdAt,
    };
  }
}
