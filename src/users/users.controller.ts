import { Body, Controller, Get, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDecor } from 'src/common/decorators/user.decorator';
import { UserPayload } from 'src/auth/strategy/jwt.strategy';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Put('/me')
  async updateProfile(@UserDecor() user: UserPayload, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }

  @Post('/me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UserDecor() user: UserPayload, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.uploadAvatar(user.id, file);
  }
}
