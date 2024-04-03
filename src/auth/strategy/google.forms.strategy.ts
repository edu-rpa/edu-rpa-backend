import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { ParsedQs } from "qs";
import { UserFromGoogle } from "src/users/users.service";

@Injectable()
export class GoogleFormsStrategy extends PassportStrategy(Strategy, 'google-forms') {
  constructor(
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get('GOOGLE_FORMS_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_FORMS_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_FORMS_CALLBACK_URL'),
      scope: [
        'https://www.googleapis.com/auth/forms', 
        'https://www.googleapis.com/auth/forms.responses.readonly',
        'https://www.googleapis.com/auth/drive',
        'email', 
        'profile',
      ],
    })
  }

  authenticate(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, options?: any): void {
    const { fromUser, reconnect } = req.query;
    const state = fromUser? JSON.stringify({ fromUser, reconnect }): undefined;
    super.authenticate(req, { ...options, state });
  }

  async validate(accessToken: string, refreshToken: string, profile: UserFromGoogle, done: VerifyCallback) {
    done(null, {
      accessToken,
      refreshToken,
      profile
    });
  }
}