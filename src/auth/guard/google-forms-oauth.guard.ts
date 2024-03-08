import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleFormsOauthGuard extends AuthGuard('google-forms') {
  constructor() {
    super({
      accessType: 'offline',
    });
  }
}