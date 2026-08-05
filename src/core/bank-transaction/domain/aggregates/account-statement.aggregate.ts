import { Money } from '../entities/money.vo';

export interface LedgerEntryItem {
  id: string;
  type: 'DEBIT' | 'CREDIT';
  amount: Money;
  balanceAfter: Money;
  transactionId: string;
  createdAt: Date;
}
export class AccountStatementAggregate {
  constructor(
    public readonly id: string,
    public readonly ownerName: string,
    public readonly nrcNo: string,
    public readonly balance: Money,
    public readonly ledgerEntries: LedgerEntryItem[],
  ) {}
  public static reconstitude(props: {
    id: string;
    ownerName: string;
    nrcNo: string;
    balance: Money;
    ledgerEntries: LedgerEntryItem[];
  }): AccountStatementAggregate {
    return new AccountStatementAggregate(
      props.id,
      props.ownerName,
      props.nrcNo,
      props.balance,
      props.ledgerEntries,
    );
  }
}
