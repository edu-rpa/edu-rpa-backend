import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from 'src/auth/schema/otp.schema';
import { EmailModule } from 'src/email/email.module';
import { GoogleStrategy } from './strategy/google.strategy';
import { GoogleDriveStrategy } from './strategy/google.drive.strategy';
import { ConnectionModule } from 'src/connection/connection.module';
import { GmailStrategy } from './strategy/gmail.strategy';
import { GoogleSheetsStrategy } from './strategy/google.sheets.strategy';
import { GoogleClassroomStrategy } from './strategy/google.classroom.strategy';
import { GoogleFormsStrategy } from './strategy/google.forms.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    EmailModule,
    ConnectionModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRATION_TIME') },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
  ],

  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    GoogleDriveStrategy,
    GmailStrategy,
    GoogleSheetsStrategy,
    GoogleClassroomStrategy,
    GoogleFormsStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
