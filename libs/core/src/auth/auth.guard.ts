import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(
      context.switchToHttp().getRequest<Request>().headers['x-api-token'],
    );
    return (
      this.configService.get('API_TOKEN') ===
      context.switchToHttp().getRequest<Request>().headers['x-api-token']
    );
  }
}
