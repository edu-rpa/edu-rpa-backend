import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/common/decorators/user.decorator';
import { UserPayload } from 'src/auth/strategy/jwt.strategy';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  async whoAmI(@User() user: UserPayload) {
    return this.usersService.findOneByEmail(user.email);
  }
}
