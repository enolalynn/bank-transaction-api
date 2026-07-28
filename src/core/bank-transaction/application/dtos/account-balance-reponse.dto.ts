import { ApiProperty } from '@nestjs/swagger';
import { AccountStatus } from '@prisma/client';

export class AccountBalanceResponseDto {
  @ApiProperty()
  accountId!: string;

  @ApiProperty()
  ownerName!: string;

  @ApiProperty()
  balance!: number;

  @ApiProperty()
  status!: AccountStatus;
}
