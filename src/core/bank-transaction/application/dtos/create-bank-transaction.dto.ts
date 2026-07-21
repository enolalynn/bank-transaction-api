import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

export class CreateBankTransactionDto {
  @ApiProperty({ description: 'Sender Id' })
  @IsString()
  @IsNotEmpty()
  senderId!: string;

  @ApiProperty({ description: 'Reveiver Id' })
  @IsString()
  @IsNotEmpty()
  receiverId!: string;

  @ApiProperty({ description: 'Transfer Amount' })
  @IsNumber()
  @IsPositive()
  amount!: number;
}
