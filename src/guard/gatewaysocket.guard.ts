import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { AuthGuard } from './auth.guard'; // Import your custom AuthGuard here
import { Server } from 'socket.io';
import {
  CanActivate,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: any): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException('Token not found in cookie');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: '9dsgame', // Replace with your secret key
      });
      request['user'] = payload;
      const user = await this.userService.findbyUsername(payload.username);
      if (!user) {
        context.args[1].verify = 'FALSE';
      } else {
        const IpServer = await this.userService.getServerDomain(user.username);
        context.args[1].verify = 'TRUE';
        context.args[1].DomainOwner = IpServer;
      }
    } catch (e) {
      context.args[1].verify = 'FALSE';
    }
    return context;
  }

  private extractTokenFromCookie(request: Request) {
    const [type, token] = request.headers.authorization.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
