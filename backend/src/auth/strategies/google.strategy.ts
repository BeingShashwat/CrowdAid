import { Injectable, Optional } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    const clientId = configService.get('oauth.google.clientId') || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = configService.get('oauth.google.clientSecret') || process.env.GOOGLE_CLIENT_SECRET;
    
    // This should never happen if module registration is correct
    // but check anyway to provide clear error
    if (!clientId || !clientSecret || clientId === '' || clientSecret === '') {
      throw new Error('Google OAuth credentials are required. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.');
    }
    
    super({
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: configService.get('oauth.google.callbackUrl') || process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
      provider: 'google',
      providerId: profile.id,
    };
    done(null, user);
  }
}

