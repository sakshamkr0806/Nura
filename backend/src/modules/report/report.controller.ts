import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { GetCurrentUserId } from '../../common/decorators';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Get('preview')
  getPreview(@GetCurrentUserId() userId: string) {
    return this.reportService.getReportPreview(userId);
  }

  @Get('export')
  async exportReport(@GetCurrentUserId() userId: string, @Res() res: Response) {
    const buffer = await this.reportService.generateDoctorReport(userId);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=CycleWell_Doctor_Report.pdf',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}
