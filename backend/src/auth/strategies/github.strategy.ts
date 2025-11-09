import { Injectable, Optional } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private configService: ConfigService) {
    const clientId = configService.get('oauth.github.clientId') || process.env.GITHUB_CLIENT_ID;
    const clientSecret = configService.get('oauth.github.clientSecret') || process.env.GITHUB_CLIENT_SECRET;
    
    // This should never happen if module registration is correct
    // but check anyway to provide clear error
    if (!clientId || !clientSecret || clientId === '' || clientSecret === '') {
      throw new Error('GitHub OAuth credentials are required. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in your .env file.');
    }
    
    super({
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: configService.get('oauth.github.callbackUrl') || process.env.GITHUB_CALLBACK_URL || 'http://localhost:3001/api/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const user = {
      email: profile.emails?.[0]?.value || `${profile.username}@github.local`,
      firstName: profile.displayName?.split(' ')[0] || profile.username,
      lastName: profile.displayName?.split(' ').slice(1).join(' ') || '',
      picture: profile.photos?.[0]?.value,
      accessToken,
      provider: 'github',
      providerId: profile.id,
    };
    done(null, user);
  }
}

