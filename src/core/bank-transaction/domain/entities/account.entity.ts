import { AccountStatus } from '@prisma/client';
import { Money } from './money.vo';
import {
  InactiveAccountException,
  InsufficientFundException,
} from 'src/common/exceptions/domain.exception';

export interface AccountProps {
  id: string;
  ownerName: string;
  nrcNo: string;
  balance: Money;
  status: AccountStatus;
  createdAt?: Date;
}

export class AccountEntity {
  constructor(private readonly props: AccountProps) {}
  public static reconstitute(props: AccountProps): AccountEntity {
    return new AccountEntity(props);
  }
  get id(): string {
    return this.props.id;
  }
  get ownerName(): string {
    return this.props.ownerName;
  }
  get nrcNo(): string {
    return this.props.nrcNo;
  }
  get balance(): Money {
    return this.props.balance;
  }
  get status(): AccountStatus {
    return this.props.status;
  }
  public validateCanDebit(amount: Money): void {
    if (this.status !== 'ACTIVE') throw new InactiveAccountException();
    if (this.balance.amountInCent < amount.amountInCent)
      throw new InsufficientFundException();
  }
  public validateCanCredit(): void {
    if (this.status !== 'ACTIVE') throw new InactiveAccountException();
  }
  public debit(amount: Money): void {
    this.validateCanDebit(amount);
    this.props.balance = this.props.balance.substract(amount);
  }
  public credit(amount: Money): void {
    this.validateCanCredit();
    this.props.balance = this.props.balance.add(amount);
  }
}
