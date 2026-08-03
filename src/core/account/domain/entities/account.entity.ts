import { AccountStatus } from '@prisma/client';
import { Email } from 'src/common/value-objects/email.vo';
import { NrcNo } from 'src/common/value-objects/nrc.vo';
import { PhoneNo } from 'src/common/value-objects/phone.vo';

export interface AccountProps {
  id?: string;
  ownerName: string;
  nrcNo: NrcNo;
  phoneNo: PhoneNo;
  email: Email;
  passwordHash: string;
  balance?: number;
  status?: AccountStatus;
  createdAt?: Date;
}
export class AccountEntity {
  private readonly _id?: string;
  private _ownerName: string;
  private _nrcNo: NrcNo;
  private _phoneNo: PhoneNo;
  private _email: Email;
  private _passwordHash: string;
  private _balance: number;
  private _status: AccountStatus;
  private readonly _createdAt: Date;
  constructor(props: AccountProps) {
    this._id = props.id;
    this._ownerName = props.ownerName;
    this._nrcNo = props.nrcNo;
    this._phoneNo = props.phoneNo;
    this._email = props.email;
    this._passwordHash = props.passwordHash;
    this._balance = props.balance ?? 0;
    this._status = props.status ?? AccountStatus.ACTIVE;
    this._createdAt = props.createdAt ?? new Date();
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
  get passwordHash(): string {
    return this._passwordHash;
  }
  get balance(): number {
    return this._balance;
  }
  get status(): AccountStatus {
    return this._status;
  }
  get createdStatus(): Date {
    return this._createdAt;
  }
}
