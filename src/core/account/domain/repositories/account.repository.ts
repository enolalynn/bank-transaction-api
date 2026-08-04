import { AccountEntity } from '../entities/account.entity';

export abstract class IAccountRepository {
  abstract existsByNrcOrPhoneOrEmail(
    nrc: string,
    phone: string,
    email: string,
  ): Promise<boolean>;
  abstract save(account: AccountEntity): Promise<AccountEntity>;
  abstract getById(accountId: string): Promise<AccountEntity | null>;
  abstract getAccountList(): Promise<AccountEntity[]>;
}
