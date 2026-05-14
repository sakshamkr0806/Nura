import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EmailService } from './email/email.service';
import { ReminderService } from './reminder/reminder.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [NotificationsService, EmailService, ReminderService],
  exports: [NotificationsService, ReminderService],
})
export class NotificationsModule {}
