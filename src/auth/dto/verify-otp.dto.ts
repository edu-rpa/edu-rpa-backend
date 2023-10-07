import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  otpCode: string;
}