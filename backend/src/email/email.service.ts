import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const host = this.configService.get('email.host');
    const port = this.configService.get('email.port');
    const secure = this.configService.get('email.secure');
    const user = this.configService.get('email.user');
    const password = this.configService.get('email.password');

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && password ? { user, pass: password } : undefined,
      // For MailHog (development), no auth needed
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      const from = this.configService.get('email.from');
      
      await this.transporter.sendMail({
        from,
        to,
        subject,
        html,
      });
      
      console.log(`✅ Email sent to ${to}`);
    } catch (error) {
      console.error(`❌ Failed to send email to ${to}:`, error);
      // Don't throw - allow app to continue even if email fails
    }
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const template = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verify Your Email - CrowdAid</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">CrowdAid</h1>
            <h2>Verify Your Email Address</h2>
            <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
            <p>
              <a href="{{verificationUrl}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email
              </a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all;">{{verificationUrl}}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
        </body>
      </html>
    `;

    const compiled = handlebars.compile(template);
    const frontendUrl = this.configService.get('frontendUrl');
    const html = compiled({
      verificationUrl: `${frontendUrl}/verify-email?token=${token}`,
    });

    await this.sendEmail(to, 'Verify Your Email - CrowdAid', html);
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const template = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your Password - CrowdAid</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">CrowdAid</h1>
            <h2>Reset Your Password</h2>
            <p>You requested to reset your password. Click the link below to reset it:</p>
            <p>
              <a href="{{resetUrl}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all;">{{resetUrl}}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>
          </div>
        </body>
      </html>
    `;

    const compiled = handlebars.compile(template);
    const frontendUrl = this.configService.get('frontendUrl');
    const html = compiled({
      resetUrl: `${frontendUrl}/reset-password?token=${token}`,
    });

    await this.sendEmail(to, 'Reset Your Password - CrowdAid', html);
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const template = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to CrowdAid</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">CrowdAid</h1>
            <h2>Welcome, {{name}}!</h2>
            <p>Thank you for joining CrowdAid. We're excited to have you on board!</p>
            <p>You can now:</p>
            <ul>
              <li>Request emergency assistance</li>
              <li>Connect with verified volunteers</li>
              <li>Help others in your community</li>
            </ul>
            <p>Get started by visiting our platform.</p>
            <p>Stay safe!</p>
            <p>The CrowdAid Team</p>
          </div>
        </body>
      </html>
    `;

    const compiled = handlebars.compile(template);
    const html = compiled({ name });

    await this.sendEmail(to, 'Welcome to CrowdAid', html);
  }
}

