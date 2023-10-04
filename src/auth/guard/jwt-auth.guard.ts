import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { OVERRIDE_GUARD_KEY } from 'src/common/decorators/override-guard.decorator';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const overrideGuard = this.reflector.getAllAndOverride<string>(OVERRIDE_GUARD_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (overrideGuard) {
      return true;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    
    return super.canActivate(context);
  }
}
