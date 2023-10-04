import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Request as ExpressRequest } from 'express';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { OverrideGuard } from 'src/common/decorators/override-guard.decorator';

interface AuthRequest extends ExpressRequest {
  user: Omit<User, 'hashedPassword'>;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @OverrideGuard()
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: AuthRequest) {
    return this.authService.signJwt(req.user);
  }

}
