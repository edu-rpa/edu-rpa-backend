import { Controller, Post, Body, UnauthorizedException, Get, UseGuards, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags, ApiOAuth2, ApiQuery } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { GoogleOauthGuard } from './guard/google-oauth.guard';
import { UserDecor } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entity/user.entity';
import { GoogleDriveOauthGuard } from './guard/google-drive-oath.guard';
import { UserTokenFromProvider } from 'src/connection/connection.service';
import { AuthorizationProvider } from 'src/connection/entity/connection.entity';
import { GmailOauthGuard } from './guard/gmail-oath.guard';
import { GoogleSheetsOauthGuard } from './guard/google-sheets-oath.guard';

@Controller('auth')
@ApiTags('auth')
@Public()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.signJwt(user);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.registerUser(registerDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('resend-otp')
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.authService.resendOtp(resendOtpDto);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  @ApiOAuth2(['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'])
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@UserDecor() user: User) {
    return this.authService.signJwt(user);
  }

  @Get('drive')
  @UseGuards(GoogleDriveOauthGuard)
  @ApiOAuth2(['https://www.googleapis.com/auth/drive'])
  @ApiQuery({ name: 'fromUser', required: true, type: Number, description: 'Id of user create Drive connection' })
  async googleDriveAuth() {}

  @Get('drive/callback')
  @UseGuards(GoogleDriveOauthGuard)
  async googleDriveAuthRedirect(@UserDecor() userToken: UserTokenFromProvider, @Query('state') state: string) {
    await this.authService.authorizeUserFromProvider(userToken, state, AuthorizationProvider.G_DRIVE);
    return 'Authorized Google Drive successfully';
  }

  @Get('gmail')
  @UseGuards(GmailOauthGuard)
  @ApiOAuth2(['https://mail.google.com/'])
  @ApiQuery({ name: 'fromUser', required: true, type: Number, description: 'Id of user create Gmail connection' })
  async gmailAuth() {}

  @Get('gmail/callback')
  @UseGuards(GmailOauthGuard)
  async gmailAuthRedirect(@UserDecor() userToken: UserTokenFromProvider, @Query('state') state: string) {
    await this.authService.authorizeUserFromProvider(userToken, state, AuthorizationProvider.G_GMAIL);
    return 'Authorized Gmail successfully';
  }

  @Get('sheets')
  @UseGuards(GoogleSheetsOauthGuard)
  @ApiOAuth2(['https://www.googleapis.com/auth/spreadsheets'])
  @ApiQuery({ name: 'fromUser', required: true, type: Number, description: 'Id of user create Google Sheets connection' })
  async googleSheetsAuth() {}

  @Get('sheets/callback')
  @UseGuards(GoogleSheetsOauthGuard)
  async googleSheetsAuthRedirect(@UserDecor() userToken: UserTokenFromProvider, @Query('state') state: string) {
    await this.authService.authorizeUserFromProvider(userToken, state, AuthorizationProvider.G_SHEETS);
    return 'Authorized Google Sheets successfully';
  }
}
