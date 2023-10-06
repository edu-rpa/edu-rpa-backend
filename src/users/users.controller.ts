import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDecor } from 'src/common/decorators/user.decorator';
import { UserPayload } from 'src/auth/strategy/jwt.strategy';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  async whoAmI(@UserDecor() user: UserPayload) {
    return this.usersService.findOneByEmail(user.email);
  }
}
