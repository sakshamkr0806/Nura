import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly fromEmail: string;

  constructor(private config: ConfigService) {
    this.resend = new Resend(this.config.get<string>('RESEND_API_KEY'));
    this.fromEmail =
      this.config.get<string>('RESEND_FROM_EMAIL') ?? 'noreply@cyclewell.app';
  }

  /**
   * Send a welcome email when a new user signs up.
   */
  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: 'Welcome to CycleWell 🌸',
        html: this.buildWelcomeHtml(name),
      });
      this.logger.log(`Welcome email sent → ${to}`);
    } catch (err) {
      // Email failures must never break the signup flow
      this.logger.error(`Failed to send welcome email to ${to}`, err);
    }
  }

  /**
   * Send a daily health log reminder email.
   */
  async sendDailyReminderEmail(to: string, name: string): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: "🌿 Time to log today's health data — CycleWell",
        html: this.buildDailyReminderHtml(name),
      });
      this.logger.log(`Daily reminder email sent → ${to}`);
    } catch (err) {
      this.logger.error(`Failed to send daily reminder to ${to}`, err);
    }
  }

  /**
   * Send a cycle prediction alert email.
   */
  async sendCycleAlertEmail(
    to: string,
    name: string,
    daysUntil: number,
  ): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: `🌙 Your next cycle is predicted in ${daysUntil} days — CycleWell`,
        html: this.buildCycleAlertHtml(name, daysUntil),
      });
      this.logger.log(`Cycle alert email sent → ${to}`);
    } catch (err) {
      this.logger.error(`Failed to send cycle alert to ${to}`, err);
    }
  }

  /**
   * Send a password reset email (placeholder — link generation handled by future auth endpoint).
   */
  async sendPasswordResetEmail(
    to: string,
    name: string,
    resetLink: string,
  ): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: 'Reset your CycleWell password',
        html: this.buildPasswordResetHtml(name, resetLink),
      });
      this.logger.log(`Password reset email sent → ${to}`);
    } catch (err) {
      this.logger.error(`Failed to send password reset to ${to}`, err);
    }
  }

  // ─── HTML Builders ───────────────────────────────────────────────────────────

  private buildWelcomeHtml(name: string): string {
    return `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:12px;border:1px solid #f0e6ff">
        <h1 style="color:#7c3aed;margin:0 0 8px">Welcome to CycleWell 🌸</h1>
        <p style="color:#374151;font-size:15px">Hi ${name},</p>
        <p style="color:#374151;font-size:15px;line-height:1.6">
          You've successfully created your CycleWell account. Start tracking your cycle, logging daily health data, and getting personalized AI insights.
        </p>
        <a href="${this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:5173'}/dashboard"
           style="display:inline-block;margin-top:16px;padding:12px 24px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
          Go to Dashboard →
        </a>
        <p style="margin-top:32px;color:#9ca3af;font-size:12px">
          You received this because you signed up for CycleWell.<br/>
          If this wasn't you, please ignore this email.
        </p>
      </div>
    `;
  }

  private buildDailyReminderHtml(name: string): string {
    const today = new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    return `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:12px;border:1px solid #f0e6ff">
        <h2 style="color:#7c3aed;margin:0 0 8px">Daily Health Log Reminder 🌿</h2>
        <p style="color:#374151;font-size:15px">Hi ${name},</p>
        <p style="color:#374151;font-size:15px;line-height:1.6">
          It's <strong>${today}</strong>. Don't forget to log your symptoms, mood, and daily wellness data to keep your cycle insights accurate.
        </p>
        <a href="${this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:5173'}/dashboard"
           style="display:inline-block;margin-top:16px;padding:12px 24px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
          Log Today's Data →
        </a>
        <p style="margin-top:32px;color:#9ca3af;font-size:12px">
          You're receiving this because you opted in to daily reminders.<br/>
          <a href="${this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:5173'}/settings" style="color:#9ca3af">Manage notification preferences</a>
        </p>
      </div>
    `;
  }

  private buildCycleAlertHtml(name: string, daysUntil: number): string {
    return `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:12px;border:1px solid #f0e6ff">
        <h2 style="color:#7c3aed;margin:0 0 8px">Cycle Prediction Alert 🌙</h2>
        <p style="color:#374151;font-size:15px">Hi ${name},</p>
        <p style="color:#374151;font-size:15px;line-height:1.6">
          Based on your tracked data, your next cycle is predicted to start in <strong>${daysUntil} day${daysUntil !== 1 ? 's' : ''}</strong>.
          Stay prepared and keep logging!
        </p>
        <a href="${this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:5173'}/dashboard"
           style="display:inline-block;margin-top:16px;padding:12px 24px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
          View Cycle Insights →
        </a>
        <p style="margin-top:32px;color:#9ca3af;font-size:12px">
          You're receiving this because you opted in to cycle alerts.<br/>
          <a href="${this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:5173'}/settings" style="color:#9ca3af">Manage notification preferences</a>
        </p>
      </div>
    `;
  }

  private buildPasswordResetHtml(name: string, resetLink: string): string {
    return `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:12px;border:1px solid #f0e6ff">
        <h2 style="color:#7c3aed;margin:0 0 8px">Reset Your Password 🔐</h2>
        <p style="color:#374151;font-size:15px">Hi ${name},</p>
        <p style="color:#374151;font-size:15px;line-height:1.6">
          We received a request to reset your CycleWell password. Click the button below to set a new one. This link expires in 1 hour.
        </p>
        <a href="${resetLink}"
           style="display:inline-block;margin-top:16px;padding:12px 24px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
          Reset Password →
        </a>
        <p style="margin-top:16px;color:#6b7280;font-size:13px">
          If you didn't request this, please ignore this email. Your password will not change.
        </p>
      </div>
    `;
  }
}
