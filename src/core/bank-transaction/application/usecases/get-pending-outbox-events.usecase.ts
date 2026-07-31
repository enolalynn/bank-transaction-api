import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/infrastructure/prisma.service';

@Injectable()
export class GetPendingOutboxEventsUsecase {
  constructor(private readonly prisma: PrismaService) {}
  async execute() {
    return await this.prisma.outboxEvent.findMany({
      where: { status: { in: ['FAILED', 'PENDING'] } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}
