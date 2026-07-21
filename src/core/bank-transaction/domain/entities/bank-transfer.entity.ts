import { BadRequestException } from '@nestjs/common';
import { TransactionStatus } from '@prisma/client';

export interface BankTransferProps {
  id?: string;
  amount: number;
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
    if (this.props.amount <= 0) {
      throw new BadRequestException(
        'Transfer amount must be greater than zero',
      );
    }
    if (this.props.senderId === this.props.receiverId) {
      throw new BadRequestException(
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
  get amount(): number {
    return this.props.amount;
  }

  public toPrimitives() {
    return {
      id: this.props.id,
      amount: this.props.amount,
      senderId: this.props.senderId,
      senderName: this.props.senderName,
      receiverId: this.props.receiverId,
      receiverName: this.props.receiverName,
      status: this.props.status,
      createdAt: this.props.createdAt,
    };
  }
}
