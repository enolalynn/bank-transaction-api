/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { REPOSITORY_TOKEN } from 'src/common/constants/repository.config';
import { IAccountRepository } from '../../domain/repositories/account.repository';
import { CreateAccountDto } from '../dtos/create-account.dto';
import { AccountEntity } from '../../domain/entities/account.entity';
import { NrcNo } from 'src/common/value-objects/nrc.vo';
import { PhoneNo } from 'src/common/value-objects/phone.vo';
import { Email } from 'src/common/value-objects/email.vo';
import * as bcrypt from 'bcrypt';
import { AccountResponseDto } from '../dtos/account-response.dto';

@Injectable()
export class CreateAccountUsecase {
  constructor(
    @Inject(REPOSITORY_TOKEN.ACCOUNT)
    private readonly accountRepo: IAccountRepository,
  ) {}
  async execute(dto: CreateAccountDto): Promise<AccountResponseDto> {
    let nrc: NrcNo;
    let phone: PhoneNo;
    let email: Email;

    try {
      nrc = NrcNo.create(dto.nrcNo);
      phone = PhoneNo.create(dto.phoneNo);
      email = Email.create(dto.email);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    const exists = await this.accountRepo.existsByNrcOrPhoneOrEmail(
      nrc.value,
      phone.value,
      email.value,
    );

    if (exists) {
      throw new ConflictException(
        'An account with this NRC, Phone, or Email already exists.',
      );
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const account = AccountEntity.create({
      ownerName: dto.ownerName,
      nrcNo: nrc,
      phoneNo: phone,
      email: email,
      password: passwordHash,
    });

    const saved = await this.accountRepo.save(account);
    return {
      id: saved.id!,
      ownerName: saved.ownerName,
      nrcNo: saved.nrcNo.value,
      phoneNo: saved.phoneNo.value,
      email: saved.email.value,
      balance: saved.balance,
      status: saved.status,
      createdAt: saved.createdAt,
    };
  }
}
