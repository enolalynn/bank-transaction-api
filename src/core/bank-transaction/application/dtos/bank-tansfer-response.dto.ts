import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionStatus } from '@prisma/client';

export class BankTransactionResponse {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  amount!: number;

  @ApiProperty()
  senderId!: string;

  @ApiPropertyOptional()
  senderName?: string;

  @ApiProperty()
  receiverId!: string;

  @ApiPropertyOptional()
  receiverName?: string;

  @ApiProperty({ enum: TransactionStatus })
  status!: TransactionStatus;

  @ApiProperty()
  createdAt!: Date;
}
