import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountStatus } from '@prisma/client';
import { BankTransactionResponse } from 'src/core/bank-transaction/application/dtos/bank-tansfer-response.dto';

export class AccountResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  ownerName: string;

  @ApiProperty()
  nrcNo: string;

  @ApiProperty()
  phoneNo: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  status: AccountStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional()
  transactions?: BankTransactionResponse[];
}
