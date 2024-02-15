import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleClassroomOauthGuard extends AuthGuard('google-classroom') {
  constructor() {
    super({
      accessType: 'offline',
    });
  }
}