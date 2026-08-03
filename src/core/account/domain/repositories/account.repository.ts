import { AccountEntity } from '../entities/account.entity';

export interface IAccountRepository {
  existsByNrcOrPhoneOrEmail(
    nrc: string,
    phone: string,
    email: string,
  ): Promise<boolean>;
  save(account: AccountEntity): Promise<AccountEntity>;
}

// export const ACCOUNT_REPOSITORY = Symbol('IAccountRepository');
