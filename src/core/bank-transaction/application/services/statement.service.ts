import { Inject } from '@nestjs/common';
import { REPOSITORY_TOKEN } from 'src/common/constants/repository.config';
import { IBankTransferRepository } from '../../domain/repository/bank-transfer.repository';
import { Response } from 'express';
import * as Workbook from 'exceljs';
import PDFDocument from 'pdfkit';

export class AccountStatementService {
  constructor(
    @Inject(REPOSITORY_TOKEN.BANK_TRANSFER)
    private readonly bankRepo: IBankTransferRepository,
  ) {}
  async exportExcel(accountId: string, res: Response) {
    const account = await this.bankRepo.getAccountWithTransaction(accountId);
    const workbook = new Workbook.Workbook();
    const sheet = workbook.addWorksheet('Bank statement');
    sheet.columns = [
      { header: 'Date', key: 'createdAt', width: 25 },
      { header: 'Entry ID', key: 'id', width: 30 },
      { header: 'Type', key: 'type', width: 12 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Balance After', key: 'balanceAfter', width: 18 },
    ];

    sheet.getRow(1).font = { bold: true };
    account.ledgerEntries.forEach((entry) => {
      sheet.addRow({
        createdAt: entry.createdAt.toISOString(),
        id: entry.id,
        type: entry.type,
        amount: entry.amount.toDecimal(),
        balanceAfter: entry.balanceAfter.toDecimal(),
      });
    });
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=statement-${accountId}.xlsx`,
    );
    await workbook.xlsx.write(res);
    res.end();
  }

  async exportPdf(accountId: string, res: Response) {
    const account = await this.bankRepo.getAccountWithTransaction(accountId);
    const doc = new PDFDocument({ margin: 50 });
    res.header('Content-Type', 'application/pdf');
    res.header(
      'Content-Disposition',
      `attachment; filename=statement-${accountId}.pdf`,
    );
    doc.pipe(res);

    doc.fontSize(20).text('OFFICIAL BANK STATEMENT', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(` Account Owner: ${account.ownerName}`);
    doc.text(`Account ID: ${account.id}`);
    doc.text(`NRC No: ${account.nrcNo}`);
    doc.text(`Current Balance: $${account.balance.toDecimal()}`);
    doc.moveDown();
    doc.text('--------------------------------------------');
    doc.fontSize(14).text(`Transaction History:`, { underline: true });
    doc.moveDown(0.5);
    account.ledgerEntries.forEach((entry, index) => {
      doc
        .fontSize(10)
        .text(
          `${index + 1}. [${entry.type}] $${entry.amount.toDecimal()} | Balance: $${entry.balanceAfter.toDecimal()} | Date: ${entry.createdAt.toISOString()}`,
        );
      doc.moveDown(0.3);
    });
    doc.end();
  }
}
