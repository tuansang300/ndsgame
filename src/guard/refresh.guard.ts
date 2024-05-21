import { CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: any): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException('Token not found in cookie');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: '9dsgame',
      });
      request['user'] = payload;
    } catch (e) {
      console.error('Failed to verify token:', e.message);
      throw new UnauthorizedException('Invalid token refresh');
    }
    return true;
  }

  private extractTokenFromCookie(request: Request) {
    const [type, token] = request.headers.authorization.split(' ') ?? [];
    return type === 'Refresh' ? token : undefined;
  }
}
