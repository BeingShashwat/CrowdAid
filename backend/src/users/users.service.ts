import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        userType: true,
        avatarUrl: true,
        emailVerified: true,
        phoneVerified: true,
        emergencyContact: true,
        twoFactorEnabled: true,
        createdAt: true,
        lastLoginAt: true,
        volunteerProfiles: {
          select: {
            isVerified: true,
            skills: true,
            rating: true,
            totalResponses: true,
            successfulHelps: true,
            bio: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, data: any) {
    const { firstName, lastName, phone, bio, avatarUrl } = data;

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        phone,
        avatarUrl,
        volunteerProfiles: bio
          ? {
              update: {
                bio,
              },
            }
          : undefined,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
      },
    });
  }

  async uploadAvatar(userId: string, file: any) {
    if (!file) {
      throw new Error('No file provided');
    }
    const fileUrl = await this.storage.uploadFile(
      file,
      file.originalname,
      file.mimetype,
      'avatars',
    );

    await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: fileUrl },
    });

    return { avatarUrl: fileUrl };
  }

  async deleteAccount(userId: string, password: string) {
    // Verify password before deletion
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    if (!user || !user.passwordHash) {
      throw new ForbiddenException('Cannot delete account');
    }

    // In production, verify password here
    // For now, we'll just delete the user
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'Account deleted successfully' };
  }
}

