/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/core/infrastructure/prisma/prisma.service';

@Injectable()
export class OutboxProcessorService {
  private readonly logger = new Logger(OutboxProcessorService.name);
  constructor(private readonly prisma: PrismaService) {}
  @Cron(CronExpression.EVERY_5_SECONDS)
  async processOutboxEvents() {
    const pendingEvents = await this.prisma.outboxEvent.findMany({
      where: { status: 'PENDING' },
      take: 20,
      orderBy: { createdAt: 'asc' },
    });
    if (pendingEvents.length === 0) return;
    this.logger.log(`Processing ${pendingEvents.length} outbox events.`);

    for (const event of pendingEvents) {
      try {
        await this.prisma.outboxEvent.update({
          where: { id: event.id },
          data: { status: 'PROCESSING' },
        });
        this.dispatchWebHook(event.eventType, event.payload);

        await this.prisma.outboxEvent.update({
          where: { id: event.id },
          data: { status: 'PROCESSED', processedAt: new Date() },
        });

        this.logger.log(`Successfully dispatch event: ${event.id}`);
      } catch (error) {
        this.logger.error(`Failed processing event: ${event.id}`, error.stack);
        //backoff
        await this.prisma.outboxEvent.update({
          where: { id: event.id },
          data: {
            status: event.retryCount >= 3 ? 'FAILED' : 'PENDING',
            retryCount: { increment: 1 },
            errorMessage: error.message,
          },
        });
        throw error;
      }
    }
  }

  private dispatchWebHook(eventType: string, payload: any): void {
    this.logger.log(`[WEB HOOK SIMULATION] Event: ${eventType}`, payload);
  }
}
