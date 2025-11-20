import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const adminKey = process.env.ADMIN_KEY;
    // Simple header-based admin gate for demo only
    if (!adminKey) return true; // if unset, allow
    const header = req.headers['x-admin-key'];
    return header === adminKey;
  }
}
