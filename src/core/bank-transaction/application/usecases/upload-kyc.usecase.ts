/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NotFoundException } from '@nestjs/common';

import sharp from 'sharp';
import { PrismaService } from 'src/core/infrastructure/prisma/prisma.service';
import { StorageService } from 'src/core/infrastructure/storage/storage.service';

@Injectable()
export class UploadKycUsecase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}
  async execute(accountId: string, file: Express.Multer.File) {
    const acc = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    if (!acc)
      throw new NotFoundException({
        code: 'ACCOUNT_NOT_FOUND',
        message: `Account id: ${accountId} not found`,
      });

    let buffer = file.buffer;
    let mimeType = file.mimetype;
    if (file.mimetype.startsWith('image/')) {
      buffer = await sharp(file.buffer)
        .resize({
          width: 1200,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .toBuffer();
      mimeType = 'image/jpeg';
    }
    const fileKey = `kyc/${accountId}/${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    await this.storageService.uploadFile(buffer, fileKey, mimeType);

    const record = await this.prisma.kycDocument.create({
      data: {
        accountId,
        fileKey,
        fileName: file.originalname,
        mimeType,
        fileSize: buffer.length,
        status: 'PENDING',
      },
    });

    const presignedUrl = await this.storageService.getPresignedUrl(fileKey);
    return {
      id: record.id,
      accountId: record.accountId,
      status: record.status,
      fileName: record.fileName,
      viewUrl: presignedUrl,
    };
  }
}
