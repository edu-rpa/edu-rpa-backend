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
import { Otp, OtpSchema } from 'src/schemas/otp.schema';
import { EmailModule } from 'src/email/email.module';

@Module({

  imports: [
    UsersModule, 
    PassportModule,
    EmailModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRATION_TIME') }
      }),
      inject: [ConfigService]
    }),
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }])
  ],

  providers: [
    AuthService, 
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AuthController]

})
export class AuthModule {}
