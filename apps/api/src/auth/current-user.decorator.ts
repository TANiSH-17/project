import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const auth: AuthService = req.app.get(AuthService);
  return auth.getUserFromRequest(req);
});
