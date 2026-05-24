import { Injectable } from '@nestjs/common';
import { EmailService } from './email/email.service';

/**
 * NotificationsService — public facade for other modules.
 * Callers import this; they never import EmailService directly.
 */
@Injectable()
export class NotificationsService {
  constructor(private readonly email: EmailService) {}

  async sendWelcomeNotification(
    userEmail: string,
    fullName: string,
  ): Promise<void> {
    await this.email.sendWelcomeEmail(userEmail, fullName);
  }

  async sendDailyReminder(userEmail: string, fullName: string): Promise<void> {
    await this.email.sendDailyReminderEmail(userEmail, fullName);
  }

  async sendCycleAlert(
    userEmail: string,
    fullName: string,
    daysUntil: number,
  ): Promise<void> {
    await this.email.sendCycleAlertEmail(userEmail, fullName, daysUntil);
  }

  async sendPasswordReset(
    userEmail: string,
    fullName: string,
    resetLink: string,
  ): Promise<void> {
    await this.email.sendPasswordResetEmail(userEmail, fullName, resetLink);
  }

  async sendWeeklySummary(
    userEmail: string,
    fullName: string,
    summary: string,
  ): Promise<void> {
    await this.email.sendWeeklySummaryEmail(userEmail, fullName, summary);
  }

  async sendHydrationReminder(
    userEmail: string,
    fullName: string,
  ): Promise<void> {
    await this.email.sendHydrationReminderEmail(userEmail, fullName);
  }

  async sendSleepReminder(userEmail: string, fullName: string): Promise<void> {
    await this.email.sendSleepReminderEmail(userEmail, fullName);
  }
}
