import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendOtpEmail(email: string, otpCode: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to EduRPA! Confirm your Email',
      template: 'verifyOTP.hbs',
      context: {
        name: email,
        otpCode,
      },
    });
  }
}
