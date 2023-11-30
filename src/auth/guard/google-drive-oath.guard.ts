import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleDriveOauthGuard extends AuthGuard('google-drive') {
  constructor() {
    super({
      accessType: 'offline',
    });
  }
}