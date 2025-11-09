import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async create(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: any;
  }) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type as any,
        title: data.title,
        message: data.message,
        data: data.data,
      },
    });

    // Send email notification if user has email notifications enabled
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
      select: { email: true, firstName: true },
    });

    if (user) {
      // In production, check user preferences
      await this.emailService.sendEmail(
        user.email,
        data.title,
        `<p>${data.message}</p>`,
      );
    }

    return notification;
  }

  async getUserNotifications(userId: string, unreadOnly?: boolean) {
    const where: any = { userId };
    if (unreadOnly) {
      where.read = false;
    }

    return this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: { read: true },
    });
  }

  async notifyVolunteers(emergencyId: string) {
    // Get all verified volunteers
    const volunteers = await this.prisma.volunteerProfile.findMany({
      where: { isVerified: true },
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });

    // Create notifications for all volunteers
    for (const volunteer of volunteers) {
      await this.create({
        userId: volunteer.user.id,
        type: 'EMERGENCY_ALERT',
        title: 'New Emergency Request',
        message: 'A new emergency request has been made nearby.',
        data: { emergencyId },
      });
    }
  }
}

