import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class EmergenciesService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async createEmergency(userId: string, data: any) {
    const emergency = await this.prisma.emergency.create({
      data: {
        userId,
        type: data.type,
        title: data.title,
        description: data.description,
        location: data.location,
        priority: data.priority || 'MEDIUM',
      },
    });

    // Notify nearby volunteers
    await this.notifications.notifyVolunteers(emergency.id);

    return emergency;
  }

  async getEmergencies(userId?: string, filters?: any) {
    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    return this.prisma.emergency.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        responses: {
          include: {
            emergency: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getEmergency(id: string, userId?: string) {
    const emergency = await this.prisma.emergency.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        responses: true,
      },
    });

    if (!emergency) {
      throw new NotFoundException('Emergency not found');
    }

    // Check permissions
    if (userId && emergency.userId !== userId) {
      // Only allow viewing if user is admin or volunteer responding
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (user.role !== 'ADMIN' && user.role !== 'VOLUNTEER') {
        throw new ForbiddenException('Not authorized to view this emergency');
      }
    }

    return emergency;
  }

  async updateEmergency(id: string, userId: string, data: any) {
    const emergency = await this.getEmergency(id);

    if (emergency.userId !== userId) {
      throw new ForbiddenException('Not authorized to update this emergency');
    }

    return this.prisma.emergency.update({
      where: { id },
      data,
    });
  }

  async respondToEmergency(emergencyId: string, volunteerId: string, message?: string) {
    const emergency = await this.getEmergency(emergencyId);

    if (emergency.status === 'RESOLVED' || emergency.status === 'CANCELLED') {
      throw new ForbiddenException('Emergency is already resolved or cancelled');
    }

    const response = await this.prisma.emergencyResponse.create({
      data: {
        emergencyId,
        volunteerId,
        message,
        status: 'PENDING',
      },
    });

    // Update emergency status if no one assigned yet
    if (!emergency.assignedTo) {
      await this.prisma.emergency.update({
        where: { id: emergencyId },
        data: {
          status: 'ASSIGNED',
          assignedTo: volunteerId,
        },
      });
    }

    // Notify the requester
    await this.notifications.create({
      userId: emergency.userId,
      type: 'VOLUNTEER_ASSIGNED',
      title: 'Volunteer Response',
      message: 'A volunteer has responded to your emergency request.',
      data: { emergencyId, responseId: response.id },
    });

    return response;
  }

  async resolveEmergency(id: string, userId: string) {
    const emergency = await this.getEmergency(id);

    if (emergency.userId !== userId && emergency.assignedTo !== userId) {
      throw new ForbiddenException('Not authorized to resolve this emergency');
    }

    return this.prisma.emergency.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
    });
  }
}

