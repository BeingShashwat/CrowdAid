import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class VolunteersService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  async getVolunteerProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        volunteerProfiles: true,
      },
    });

    if (!user || user.userType !== 'VOLUNTEER') {
      throw new NotFoundException('Volunteer profile not found');
    }

    return user;
  }

  async createOrUpdateVolunteerProfile(userId: string, data: any) {
    const { skills, availability, location, bio, certifications } = data;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.userType !== 'VOLUNTEER') {
      throw new NotFoundException('User is not a volunteer');
    }

    return this.prisma.volunteerProfile.upsert({
      where: { userId },
      update: {
        skills,
        availability,
        location,
        bio,
        certifications,
      },
      create: {
        userId,
        skills: skills || [],
        availability,
        location,
        bio,
        certifications: certifications || [],
      },
    });
  }

  async uploadVerificationDoc(userId: string, file: any) {
    if (!file) {
      throw new Error('No file provided');
    }
    const fileUrl = await this.storage.uploadFile(
      file,
      file.originalname,
      file.mimetype,
      'verification-docs',
    );

    await this.prisma.volunteerProfile.update({
      where: { userId },
      data: { verificationDoc: fileUrl },
    });

    return { verificationDoc: fileUrl };
  }

  async getNearbyVolunteers(location: any, radius: number = 10) {
    // In a real implementation, you would use PostGIS for geospatial queries
    // For now, we'll return all active volunteers
    return this.prisma.volunteerProfile.findMany({
      where: {
        isVerified: true,
        user: {
          isActive: true,
          isBanned: false,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatarUrl: true,
          },
        },
      },
    });
  }
}

