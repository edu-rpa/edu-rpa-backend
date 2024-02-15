import { Controller, Post, Body, UnauthorizedException, Get, UseGuards, Query, Res, UseFilters } from '@nestjs/common';
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
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionRedirectISFilter, HttpExceptionRedirectLoginFilter } from 'src/common/filters/http-exception-redirect.filter';
import { GoogleClassroomOauthGuard } from './guard/google-classroom.guard';

@Controller('auth')
@ApiTags('auth')
@Public()
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

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
  @UseFilters(HttpExceptionRedirectLoginFilter)
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@UserDecor() user: User, @Res() res: Response) {
    const token = (await this.authService.signJwt(user)).accessToken;
    res.redirect(`${this.configService.get('FRONTEND_URL')}/auth/login?token=${token}`);
  }

  @Get('drive')
  @UseGuards(GoogleDriveOauthGuard)
  @ApiOAuth2(['https://www.googleapis.com/auth/drive'])
  @ApiQuery({ name: 'fromUser', required: true, type: Number, description: 'Id of user create Drive connection' })
  @ApiQuery({ name: 'reconnect', required: false, type: Boolean, description: 'Set true to replace old token' })
  async googleDriveAuth() {}

  @Get('drive/callback')
  @UseFilters(HttpExceptionRedirectISFilter)
  @UseGuards(GoogleDriveOauthGuard)
  async googleDriveAuthRedirect(
    @UserDecor() userToken: UserTokenFromProvider, 
    @Query('state') state: string, 
    @Res() res: Response
  ) {
    await this.authService.authorizeUserFromProvider(userToken, state, AuthorizationProvider.G_DRIVE);
    const message = 'Authorized Google Drive successfully!';
    res.redirect(`${this.configService.get('FRONTEND_URL')}/integration-service?provider=${AuthorizationProvider.G_DRIVE}&message=${message}`);
  }

  @Get('gmail')
  @UseGuards(GmailOauthGuard)
  @ApiOAuth2(['https://mail.google.com/'])
  @ApiQuery({ name: 'fromUser', required: true, type: Number, description: 'Id of user create Gmail connection' })
  @ApiQuery({ name: 'reconnect', required: false, type: Boolean, description: 'Set true to replace old token' })
  async gmailAuth() {}

  @Get('gmail/callback')
  @UseFilters(HttpExceptionRedirectISFilter)
  @UseGuards(GmailOauthGuard)
  async gmailAuthRedirect(
    @UserDecor() userToken: UserTokenFromProvider, 
    @Query('state') state: string,
    @Res() res: Response
  ) {
    await this.authService.authorizeUserFromProvider(userToken, state, AuthorizationProvider.G_GMAIL);
    const message = 'Authorized Gmail successfully!';
    res.redirect(`${this.configService.get('FRONTEND_URL')}/integration-service?provider=${AuthorizationProvider.G_GMAIL}&message=${message}`);
  }

  @Get('sheets')
  @UseGuards(GoogleSheetsOauthGuard)
  @ApiOAuth2(['https://www.googleapis.com/auth/spreadsheets'])
  @ApiQuery({ name: 'fromUser', required: true, type: Number, description: 'Id of user create Google Sheets connection' })
  @ApiQuery({ name: 'reconnect', required: false, type: Boolean, description: 'Set true to replace old token' })
  async googleSheetsAuth() {}

  @Get('sheets/callback')
  @UseFilters(HttpExceptionRedirectISFilter)
  @UseGuards(GoogleSheetsOauthGuard)
  async googleSheetsAuthRedirect(
    @UserDecor() userToken: UserTokenFromProvider, 
    @Query('state') state: string,
    @Res() res: Response
  ) {
    await this.authService.authorizeUserFromProvider(userToken, state, AuthorizationProvider.G_SHEETS);
    const message = 'Authorized Google Sheets successfully!';
    res.redirect(`${this.configService.get('FRONTEND_URL')}/integration-service?provider=${AuthorizationProvider.G_SHEETS}&message=${message}`);
  }

  @Get('classroom')
  @UseGuards(GoogleClassroomOauthGuard)
  @ApiOAuth2(['https://www.googleapis.com/auth/classroom.courses'])
  @ApiQuery({ name: 'fromUser', required: true, type: Number, description: 'Id of user create Google Classroom connection' })
  @ApiQuery({ name: 'reconnect', required: false, type: Boolean, description: 'Set true to replace old token' })
  async googleClassroomAuth() {}

  @Get('classroom/callback')
  @UseFilters(HttpExceptionRedirectISFilter)
  @UseGuards(GoogleClassroomOauthGuard)
  async googleClassroomAuthRedirect(
    @UserDecor() userToken: UserTokenFromProvider, 
    @Query('state') state: string,
    @Res() res: Response
  ) {
    await this.authService.authorizeUserFromProvider(userToken, state, AuthorizationProvider.G_CLASSROOM);
    const message = 'Authorized Google Classroom successfully!';
    res.redirect(`${this.configService.get('FRONTEND_URL')}/integration-service?provider=${AuthorizationProvider.G_CLASSROOM}&message=${message}`);
  }
}
