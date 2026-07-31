import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/infrastructure/prisma/prisma.service';

@Injectable()
export class RetryFailedEventsUsecase {
  constructor(private readonly prisma: PrismaService) {}
  async execute(id: string) {
    const existingEvents = await this.prisma.outboxEvent.findUnique({
      where: { id },
    });
    if (!existingEvents) {
      throw new NotFoundException({
        code: 'OUTBOX_EVENT_NOT_FOUND',
        message: `Outbox events ${id} not found.`,
      });
    }
    return await this.prisma.outboxEvent.update({
      where: { id },
      data: { status: 'PENDING', retryCount: 0, errorMessage: null },
    });
  }
}
