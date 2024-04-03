import { Injectable } from '@nestjs/common';
import { AuthorizationProvider } from 'src/connection/entity/connection.entity';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleService {
  oauth2Clients: Record<string, OAuth2Client>;

  constructor(
    readonly configService: ConfigService,
  ) {
    this.oauth2Clients = {
      [AuthorizationProvider.G_DRIVE]: new google.auth.OAuth2(
        configService.get('GOOGLE_DRIVE_CLIENT_ID'),
        configService.get('GOOGLE_DRIVE_CLIENT_SECRET'),
        configService.get('GOOGLE_DRIVE_CALLBACK_URL'),
      ),
      [AuthorizationProvider.G_SHEETS]: new google.auth.OAuth2(
        configService.get('GOOGLE_SHEETS_CLIENT_ID'),
        configService.get('GOOGLE_SHEETS_CLIENT_SECRET'),
        configService.get('GOOGLE_SHEETS_CALLBACK_URL'),
      ),
      [AuthorizationProvider.G_GMAIL]: new google.auth.OAuth2(
        configService.get('GMAIL_CLIENT_ID'),
        configService.get('GMAIL_CLIENT_SECRET'),
        configService.get('GMAIL_CALLBACK_URL'),
      ),
      [AuthorizationProvider.G_CLASSROOM]: new google.auth.OAuth2(
        configService.get('GOOGLE_CLASSROOM_CLIENT_ID'),
        configService.get('GOOGLE_CLASSROOM_CLIENT_SECRET'),
        configService.get('GOOGLE_CLASSROOM_CALLBACK_URL'),
      ),
      [AuthorizationProvider.G_FORMS]: new google.auth.OAuth2(
        configService.get('GOOGLE_FORMS_CLIENT_ID'),
        configService.get('GOOGLE_FORMS_CLIENT_SECRET'),
        configService.get('GOOGLE_FORMS_CALLBACK_URL'),
      ),
    };
  }

  getOAuth2Client(provider: AuthorizationProvider): OAuth2Client {
    return this.oauth2Clients[provider];
  }
}
