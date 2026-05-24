import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
  ) {}

  /**
   * Send daily health log reminders to all opted-in users.
   * '0 8 * * *' = every day at 08:00 server time.
   */
  @Cron('0 8 * * *')
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
   * Send weekly wellness summaries to all opted-in users on Sunday at 9 AM.
   */
  @Cron('0 9 * * 0')
  async sendWeeklySummaries(): Promise<void> {
    this.logger.log('Running weekly wellness summary job...');

    const users = await this.prisma.user.findMany({
      where: { emailNotifications: true },
      include: { healthProfile: true },
    });

    this.logger.log(`Sending weekly summaries to ${users.length} user(s)`);

    await Promise.allSettled(
      users.map((user) => {
        const summary =
          user.healthProfile?.cycleInsights ||
          'Log your daily symptoms on CycleWell to get personalized wellness analysis!';
        return this.email.sendWeeklySummaryEmail(
          user.email,
          user.fullName || 'there',
          summary,
        );
      }),
    );

    this.logger.log('Weekly wellness summary job complete');
  }

  /**
   * Send hydration reminders at 2 PM daily.
   */
  @Cron('0 14 * * *')
  async sendHydrationReminders(): Promise<void> {
    this.logger.log('Running daily hydration reminder job...');

    const users = await this.prisma.user.findMany({
      where: { emailNotifications: true },
      select: { email: true, fullName: true },
    });

    await Promise.allSettled(
      users.map((user) =>
        this.email.sendHydrationReminderEmail(
          user.email,
          user.fullName || 'there',
        ),
      ),
    );

    this.logger.log('Hydration reminder job complete');
  }

  /**
   * Send sleep reminders at 9 PM daily.
   */
  @Cron('0 21 * * *')
  async sendSleepReminders(): Promise<void> {
    this.logger.log('Running daily sleep reminder job...');

    const users = await this.prisma.user.findMany({
      where: { emailNotifications: true },
      select: { email: true, fullName: true },
    });

    await Promise.allSettled(
      users.map((user) =>
        this.email.sendSleepReminderEmail(user.email, user.fullName || 'there'),
      ),
    );

    this.logger.log('Sleep reminder job complete');
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
