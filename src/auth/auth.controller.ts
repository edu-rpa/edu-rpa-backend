import { Controller, Post, Body, UnauthorizedException, Get, UseGuards, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { GoogleOauthGuard } from './guard/google-oauth.guard';
import { UserDecor } from 'src/common/decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import { GoogleDriveOauthGuard } from './guard/google-drive-oath.guard';
import { UserTokenFromProvider } from 'src/connection/connection.service';
import { AuthorizationProvider } from 'src/entities/connection.entity';

@Controller('auth')
@ApiTags('auth')
@Public()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.signJwt(user);
  }

  @Post('register')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
      },
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.registerUser(registerDto);
  }

  @Post('verify-otp')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
        },
        otpCode: {
          type: 'string',
        },
      },
    },
  })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('resend-otp')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
        },
      },
    },
  })
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.authService.resendOtp(resendOtpDto);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@UserDecor() user: User) {
    return this.authService.signJwt(user);
  }

  @Get('drive')
  @UseGuards(GoogleDriveOauthGuard)
  async googleDriveAuth() {}

  @Get('drive/callback')
  @UseGuards(GoogleDriveOauthGuard)
  async googleDriveAuthRedirect(@UserDecor() userToken: UserTokenFromProvider, @Query('state') state: string) {
    await this.authService.authorizeUserFromProvider(userToken, state, AuthorizationProvider.G_DRIVE);
    return 'Authorized Google Drive successfully';
  }
}
