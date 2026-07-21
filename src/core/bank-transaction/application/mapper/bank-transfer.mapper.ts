import { BankTransfer } from '../../domain/entities/bank-transfer.entity';
import { BankTransactionResponse } from '../dtos/bank-tansfer-response.dto';

export class BankTransferMapper {
  public static toResponse(record: BankTransfer): BankTransactionResponse {
    const entity = record.toPrimitives();
    return {
      id: entity.id!,
      amount: entity.amount,
      senderId: entity.senderId,
      senderName: entity.senderName || 'Unknown sender',
      receiverId: entity.receiverId,
      receiverName: entity.receiverName || 'Unknown receiver',
      status: entity.status!,
      createdAt: entity.createdAt!,
    };
  }
}
