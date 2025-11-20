import { Injectable } from '@nestjs/common';

export type SessionUser = { email: string; role: 'ADMIN' | 'BRAND' | 'PARTICIPANT' } | null;

@Injectable()
export class AuthService {
  getUserFromRequest(req: any): SessionUser {
    // Demo: derive identity from headers; replace with Clerk/Auth0
    const email = req.headers['x-user-email'] as string | undefined;
    const role = (req.headers['x-user-role'] as string | undefined)?.toUpperCase() as any;
    if (!email) return null;
    if (role === 'ADMIN' || role === 'BRAND' || role === 'PARTICIPANT') return { email, role };
    return { email, role: 'PARTICIPANT' };
  }
}
