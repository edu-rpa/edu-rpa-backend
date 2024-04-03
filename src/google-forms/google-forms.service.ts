import { Injectable } from "@nestjs/common";
import { google, forms_v1, drive_v3 } from 'googleapis';
import { GoogleService } from "src/google/google.service";
import { AuthorizationProvider } from "src/connection/entity/connection.entity";
import { ConnectionService } from "src/connection/connection.service";
import { ConnectionNotFoundException } from "src/common/exceptions";
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleFormsService {
  formsOAuth2Client: OAuth2Client;
  driveOAuth2Client: OAuth2Client;
  forms: forms_v1.Forms;
  drive: drive_v3.Drive;
  provider: AuthorizationProvider = AuthorizationProvider.G_FORMS;

  constructor(
    private googleService: GoogleService,
    private connectionService: ConnectionService,
  ) {
    this.formsOAuth2Client = this.googleService.getOAuth2Client(this.provider);
    this.driveOAuth2Client = this.googleService.getOAuth2Client(AuthorizationProvider.G_DRIVE);
  }
  
  async getForms(userId: number, connectionName: string) {
    const connection = await this.connectionService.getConnection(userId, {
      name: connectionName,
      provider: this.provider,
    });

    if (!connection) {
      throw new ConnectionNotFoundException();
    }

    this.driveOAuth2Client.setCredentials({
      access_token: connection.accessToken,
      refresh_token: connection.refreshToken,
    });
    this.drive = google.drive({ version: 'v3', auth: this.driveOAuth2Client });
    const q = `mimeType='application/vnd.google-apps.form'`;
    const response = await this.drive.files.list({ q });

    return response.data.files;
  }
}