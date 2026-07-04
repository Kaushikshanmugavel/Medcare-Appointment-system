import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const secretKey = request.headers['x-secret-key'];
    const configuredKey = this.configService.get<string>('secretKey');

    if (!secretKey || secretKey !== configuredKey) {
      throw new UnauthorizedException('Access denied. Invalid or missing Secret Key.');
    }

    return true;
  }
}
