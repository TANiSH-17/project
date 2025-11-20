import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private auth: AuthService) {}
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = this.auth.getUserFromRequest(req);
    const need = (req.route?.path?.includes('admin') || req.originalUrl?.includes('/applications') && req.method==='GET') ? 'ADMIN' : null;
    if (!need) return true;
    return !!user && user.role === 'ADMIN';
  }
}
