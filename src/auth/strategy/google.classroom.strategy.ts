import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ParsedQs } from 'qs';
import { UserFromGoogle } from 'src/users/users.service';

@Injectable()
export class GoogleClassroomStrategy extends PassportStrategy(Strategy, 'google-classroom') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLASSROOM_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLASSROOM_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CLASSROOM_CALLBACK_URL'),
      scope: [
        'https://www.googleapis.com/auth/classroom.courses',
        'https://www.googleapis.com/auth/classroom.announcements',
        'https://www.googleapis.com/auth/classroom.topics',
        'https://www.googleapis.com/auth/classroom.courseworkmaterials',
        'https://www.googleapis.com/auth/classroom.coursework.me',
        'https://www.googleapis.com/auth/classroom.coursework.students',
        'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly',
        'https://www.googleapis.com/auth/classroom.student-submissions.students.readonly',
        'https://www.googleapis.com/auth/classroom.rosters',
        'https://www.googleapis.com/auth/classroom.profile.emails',
        'email',
        'profile',
      ],
    });
  }

  authenticate(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    options?: any,
  ): void {
    const { fromUser, reconnect } = req.query;
    const state = fromUser ? JSON.stringify({ fromUser, reconnect }) : undefined;
    super.authenticate(req, { ...options, state });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: UserFromGoogle,
    done: VerifyCallback,
  ) {
    done(null, {
      accessToken,
      refreshToken,
      profile,
    });
  }
}
