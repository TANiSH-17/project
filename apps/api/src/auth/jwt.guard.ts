import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { importJWK, jwtVerify, JWTPayload } from 'jose';

function getEnv(name: string) { return process.env[name]; }

@Injectable()
export class JwtGuard implements CanActivate {
  private jwksCache: Record<string, any> = {};

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'] as string | undefined;
    const jwksUrl = getEnv('AUTH_JWKS_URL');
    const issuer = getEnv('AUTH_ISSUER');
    const audience = getEnv('AUTH_AUDIENCE');
    if (!auth || !auth.startsWith('Bearer ') || !jwksUrl) return true; // optional in demo
    const token = auth.slice('Bearer '.length);
    try {
      const { payload } = await this.verifyWithJwks(token, { jwksUrl, issuer, audience });
      req.user = payload;
      return true;
    } catch (e) {
      // fail open in demo mode; set AUTH_JWKS_URL to enforce
      if (getEnv('AUTH_ENFORCE') === '1') return false;
      return true;
    }
  }

  private async verifyWithJwks(token: string, opts: { jwksUrl: string; issuer?: string; audience?: string }) {
    // Minimal JWKS fetcher; for production consider caching keys and handling kid header
    const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString());
    const kid = header.kid;
    const jwks = await fetch(opts.jwksUrl).then(r=>r.json());
    const key = jwks.keys?.find((k: any) => k.kid === kid) || jwks.keys?.[0];
    if (!key) throw new Error('No JWKS key');
    const alg = key.alg || 'RS256';
    const jwk = { ...key, alg } as any;
    const publicKey = await importJWK(jwk, alg);
    const { payload } = await jwtVerify(token, publicKey, { issuer: opts.issuer, audience: opts.audience });
    return { payload } as { payload: JWTPayload };
  }
}
