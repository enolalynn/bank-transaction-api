import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { BankTransferModule } from './core/bank-transaction/bank-transfer.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), BankTransferModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
