import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email/email.service';

/**
 * ReminderService — scheduler-ready service for sending bulk email reminders.
 *
 * ─── TO ACTIVATE CRON SCHEDULING ────────────────────────────────────────────
 * 1. Install: npm install @nestjs/schedule
 * 2. In app.module.ts, add to imports: ScheduleModule.forRoot()
 * 3. Import ScheduleModule from '@nestjs/schedule'
 * 4. Uncomment the @Cron decorator below and the Cron import
 * ─────────────────────────────────────────────────────────────────────────────
 */
// import { Cron } from '@nestjs/schedule';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
  ) {}

  /**
   * Send daily health log reminders to all opted-in users.
   *
   * Activate by uncommenting the @Cron decorator.
   * '0 8 * * *' = every day at 08:00 server time.
   */
  // @Cron('0 8 * * *')
  async sendDailyReminders(): Promise<void> {
    this.logger.log('Running daily reminder job...');

    const users = await this.prisma.user.findMany({
      where: { emailNotifications: true },
      select: { email: true, fullName: true },
    });

    this.logger.log(`Sending reminders to ${users.length} user(s)`);

    // Fire reminders concurrently but don't let one failure block others
    await Promise.allSettled(
      users.map((user) =>
        this.email.sendDailyReminderEmail(user.email, user.fullName || 'there'),
      ),
    );

    this.logger.log('Daily reminder job complete');
  }

  /**
   * Send cycle prediction alerts to opted-in users.
   * Called by the cycle prediction logic when a cycle is forecasted.
   *
   * @param userId - The user to alert
   * @param daysUntil - How many days until the predicted cycle start
   */
  async sendCycleAlert(userId: string, daysUntil: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, fullName: true, emailNotifications: true },
    });

    if (!user || !user.emailNotifications) return;

    await this.email.sendCycleAlertEmail(
      user.email,
      user.fullName || 'there',
      daysUntil,
    );
  }
}
