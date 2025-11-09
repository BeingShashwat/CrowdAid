import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { authenticator } from 'otplib';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redis: RedisService,
    private emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    if (!user.isActive || user.isBanned) {
      throw new UnauthorizedException('Account is inactive or banned');
    }

    const { passwordHash, twoFactorSecret, ...result } = user;
    return result;
  }

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, phone, userType, agreeToTerms, emergencyContact } = registerDto;

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(
      password,
      this.configService.get('security.bcryptRounds'),
    );

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        userType,
        role: userType === 'VOLUNTEER' ? 'VOLUNTEER' : 'USER',
        emergencyContact,
        emailVerified: false,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        userType: true,
      },
    });

    // Generate verification token
    const verificationToken = uuidv4();
    await this.prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        type: 'email',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Send verification email
    await this.emailService.sendVerificationEmail(email, verificationToken);
    await this.emailService.sendWelcomeEmail(email, `${firstName} ${lastName}`);

    return {
      message: 'Registration successful. Please check your email to verify your account.',
      user,
    };
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const { email, password, rememberMe } = loginDto;

    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if 2FA is enabled
    const fullUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { twoFactorEnabled: true },
    });

    if (fullUser.twoFactorEnabled) {
      // Return a token that requires 2FA verification
      const tempToken = this.jwtService.sign(
        { sub: user.id, requires2FA: true },
        { expiresIn: '10m' },
      );
      return {
        requires2FA: true,
        tempToken,
      };
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Send login notification email
    try {
      const fullUser = await this.prisma.user.findUnique({
        where: { id: user.id },
        select: { email: true, firstName: true },
      });
      
      if (fullUser) {
        await this.emailService.sendEmail(
          fullUser.email,
          'Login Notification - CrowdAid',
          `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2563eb;">Login Detected</h2>
              <p>Hello ${fullUser.firstName},</p>
              <p>You have successfully logged into your CrowdAid account.</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              <p>If this wasn't you, please change your password immediately.</p>
              <p>Stay safe!</p>
            </div>
          `,
        );
      }
    } catch (error) {
      // Don't fail login if email fails
      console.error('Failed to send login notification:', error);
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, email);

    // Create session
    const sessionExpires = rememberMe
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: sessionExpires,
        ipAddress,
        userAgent,
      },
    });

    return {
      user,
      ...tokens,
    };
  }

  async verify2FA(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    });

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      throw new BadRequestException('2FA is not enabled for this user');
    }

    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }

    return { verified: true };
  }

  async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.secret'),
      expiresIn: this.configService.get('jwt.expiresIn'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.refreshSecret'),
      expiresIn: this.configService.get('jwt.refreshExpiresIn'),
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt.refreshSecret'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          userType: true,
          isActive: true,
          isBanned: true,
        },
      });

      if (!user || !user.isActive || user.isBanned) {
        throw new UnauthorizedException('User not found or inactive');
      }

      return this.generateTokens(user.id, user.email);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(sessionToken: string) {
    await this.prisma.session.deleteMany({
      where: { sessionToken },
    });
    return { message: 'Logged out successfully' };
  }

  async verifyEmail(token: string) {
    const verificationToken = await this.prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: true },
    });

    await this.prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return { message: 'Email verified successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists
      return { message: 'If the email exists, a password reset link has been sent.' };
    }

    const token = uuidv4();
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    await this.emailService.sendPasswordResetEmail(email, token);

    return { message: 'If the email exists, a password reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expiresAt < new Date() || resetToken.used) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(
      newPassword,
      this.configService.get('security.bcryptRounds'),
    );

    await this.prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    });

    await this.prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    });

    return { message: 'Password reset successfully' };
  }

  async setup2FA(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user.twoFactorEnabled) {
      throw new BadRequestException('2FA is already enabled');
    }

    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(
      user.email,
      this.configService.get('security.totpIssuer'),
      secret,
    );

    // Store encrypted secret temporarily (in production, encrypt this)
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret },
    });

    return {
      secret,
      otpAuthUrl,
      message: 'Scan the QR code with your authenticator app',
    };
  }

  async enable2FA(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true },
    });

    if (!user.twoFactorSecret) {
      throw new BadRequestException('2FA setup not initiated');
    }

    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });

    return { message: '2FA enabled successfully' };
  }

  async disable2FA(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    });

    if (!user.twoFactorEnabled) {
      throw new BadRequestException('2FA is not enabled');
    }

    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: false, twoFactorSecret: null },
    });

    return { message: '2FA disabled successfully' };
  }

  async oauthLogin(profile: any) {
    const { email, firstName, lastName, picture, provider, providerId, accessToken } = profile;

    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          avatarUrl: picture,
          emailVerified: true, // OAuth emails are pre-verified
          userType: 'USER',
          role: 'USER',
        },
      });
    }

    // Create or update OAuth account
    await this.prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId: providerId,
        },
      },
      update: {
        accessToken,
        expiresAt: Math.floor(Date.now() / 1000) + 3600,
      },
      create: {
        userId: user.id,
        provider,
        providerAccountId: providerId,
        accessToken,
        expiresAt: Math.floor(Date.now() / 1000) + 3600,
      },
    });

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        userType: user.userType,
      },
      ...tokens,
    };
  }
}

