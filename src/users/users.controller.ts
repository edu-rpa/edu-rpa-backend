import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDecor } from 'src/common/decorators/user.decorator';
import { UserPayload } from 'src/auth/strategy/jwt.strategy';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  async whoAmI(@UserDecor() userPayload: UserPayload) {
    return this.usersService.findOneByEmail(userPayload.email, {
      exclude: ['hashedPassword'],
    });
  }
}
