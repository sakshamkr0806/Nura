import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subDays, format } from 'date-fns';
import * as PDFDocument from 'pdfkit';
// @ts-ignore
const PDFDoc = PDFDocument.default || PDFDocument;

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async generateDoctorReport(userId: string): Promise<Buffer> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    
    const cycles = await this.prisma.cycle.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
      take: 6,
    });

    const logs = await this.prisma.dailyLog.findMany({
      where: {
        userId,
        date: { gte: subDays(new Date(), 90) },
      },
      orderBy: { date: 'desc' },
    });

    return new Promise((resolve) => {
      const doc = new PDFDoc({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Header
      doc.fontSize(20).text('Hormonal Wellness Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Patient Name: ${user.name || 'N/A'}`);
      doc.text(`Patient Email: ${user.email}`);
      doc.text(`Report Date: ${format(new Date(), 'PPP')}`);
      doc.moveDown();
      doc.rect(50, doc.y, 500, 2).fill('#e2e8f0');
      doc.moveDown();

      // Cycle History
      doc.fontSize(16).text('Cycle History (Last 6 Months)', { underline: true });
      doc.moveDown(0.5);
      cycles.forEach((cycle, i) => {
        const start = format(cycle.startDate, 'MMM d, yyyy');
        const end = cycle.endDate ? format(cycle.endDate, 'MMM d, yyyy') : 'In Progress';
        doc.fontSize(10).text(`${i + 1}. ${start} - ${end}`);
      });
      doc.moveDown();

      // Symptom Summary
      doc.fontSize(16).text('Symptom Frequency (Last 90 Days)', { underline: true });
      doc.moveDown(0.5);
      const symptomCounts: Record<string, number> = {};
      logs.forEach(log => {
        log.symptoms.forEach(s => {
          symptomCounts[s] = (symptomCounts[s] || 0) + 1;
        });
      });

      Object.entries(symptomCounts).forEach(([symptom, count]) => {
        doc.fontSize(10).text(`${symptom}: ${count} days`);
      });
      doc.moveDown();

      // Wellness Averages
      doc.fontSize(16).text('Wellness Metrics (Last 90 Days)', { underline: true });
      doc.moveDown(0.5);
      const avgSleep = logs.reduce((acc, l) => acc + (l.sleepHours || 0), 0) / (logs.length || 1);
      const avgWater = logs.reduce((acc, l) => acc + (l.waterIntake || 0), 0) / (logs.length || 1);
      doc.fontSize(10).text(`Average Sleep: ${avgSleep.toFixed(1)} hours`);
      doc.text(`Average Water Intake: ${avgWater.toFixed(0)}ml`);

      // Disclaimer
      doc.moveDown(2);
      doc.fontSize(8).fillColor('#64748b').text(
        'DISCLAIMER: This report is generated based on user-logged data in the CycleWell application. It is intended for educational purposes and to facilitate clinical discussion. This is NOT a medical diagnosis.',
        { align: 'center' }
      );

      doc.end();
    });
  }

  async getReportPreview(userId: string) {
    const logs = await this.prisma.dailyLog.findMany({
      where: { userId, date: { gte: subDays(new Date(), 90) } },
    });

    const symptomCounts: Record<string, number> = {};
    logs.forEach(log => {
      log.symptoms.forEach(s => {
        symptomCounts[s] = (symptomCounts[s] || 0) + 1;
      });
    });

    return {
      totalDaysLogged: logs.length,
      symptomFrequency: Object.entries(symptomCounts).map(([name, value]) => ({ name, value })),
      averages: {
        sleep: logs.reduce((acc, l) => acc + (l.sleepHours || 0), 0) / (logs.length || 1),
        water: logs.reduce((acc, l) => acc + (l.waterIntake || 0), 0) / (logs.length || 1),
      }
    };
  }
}
