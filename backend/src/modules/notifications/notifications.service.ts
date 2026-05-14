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
    name: string,
  ): Promise<void> {
    await this.email.sendWelcomeEmail(userEmail, name);
  }

  async sendDailyReminder(userEmail: string, name: string): Promise<void> {
    await this.email.sendDailyReminderEmail(userEmail, name);
  }

  async sendCycleAlert(
    userEmail: string,
    name: string,
    daysUntil: number,
  ): Promise<void> {
    await this.email.sendCycleAlertEmail(userEmail, name, daysUntil);
  }

  async sendPasswordReset(
    userEmail: string,
    name: string,
    resetLink: string,
  ): Promise<void> {
    await this.email.sendPasswordResetEmail(userEmail, name, resetLink);
  }
}
