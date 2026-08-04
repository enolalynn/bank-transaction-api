import { AccountStatus } from '@prisma/client';
import { Email } from 'src/common/value-objects/email.vo';
import { NrcNo } from 'src/common/value-objects/nrc.vo';
import { PhoneNo } from 'src/common/value-objects/phone.vo';
import { BankTransfer } from 'src/core/bank-transaction/domain/entities/bank-transfer.entity';

export interface AccountProps {
  id?: string;
  ownerName: string;
  nrcNo: NrcNo;
  phoneNo: PhoneNo;
  email: Email;
  password: string;
  balance?: number;
  status?: AccountStatus;
  createdAt?: Date;
  transactions?: BankTransfer[];
}
export class AccountEntity {
  private readonly _id?: string;
  private _ownerName: string;
  private _nrcNo: NrcNo;
  private _phoneNo: PhoneNo;
  private _email: Email;
  private _password: string;
  private _balance: number;
  private _status: AccountStatus;
  private readonly _createdAt: Date;
  private readonly _transactions: BankTransfer[];
  constructor(props: AccountProps) {
    this._id = props.id;
    this._ownerName = props.ownerName;
    this._nrcNo = props.nrcNo;
    this._phoneNo = props.phoneNo;
    this._email = props.email;
    this._password = props.password;
    this._balance = props.balance ?? 0;
    this._status = props.status ?? AccountStatus.ACTIVE;
    this._createdAt = props.createdAt ?? new Date();
    this._transactions = props.transactions ?? [];
  }
  public static create(props: AccountProps): AccountEntity {
    if (!props.ownerName) throw new Error('Owner Name is required.');
    return new AccountEntity(props);
  }
  get id(): string | undefined {
    return this._id;
  }
  get ownerName(): string {
    return this._ownerName;
  }
  get nrcNo(): NrcNo {
    return this._nrcNo;
  }
  get phoneNo(): PhoneNo {
    return this._phoneNo;
  }
  get email(): Email {
    return this._email;
  }
  get password(): string {
    return this._password;
  }
  get balance(): number {
    return this._balance;
  }
  get status(): AccountStatus {
    return this._status;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get transaction(): BankTransfer[] {
    return this._transactions ?? [];
  }
}
