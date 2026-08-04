import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  ownerName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nrcNo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  phoneNo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}
