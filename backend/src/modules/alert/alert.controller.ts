import { Controller, Get, Patch, Param, Post, Delete } from '@nestjs/common';
import { GetCurrentUserId } from '../../common/decorators';
import { AlertService } from './alert.service';

@Controller('alerts')
export class AlertController {
  constructor(private alertService: AlertService) {}

  @Get()
  findAll(@GetCurrentUserId() userId: string) {
    return this.alertService.findAll(userId);
  }

  @Post('evaluate')
  evaluate(@GetCurrentUserId() userId: string) {
    return this.alertService.evaluateRules(userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @GetCurrentUserId() userId: string) {
    return this.alertService.markAsRead(id, userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @GetCurrentUserId() userId: string) {
    return this.alertService.delete(id, userId);
  }
}
