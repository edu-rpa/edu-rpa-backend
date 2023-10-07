import { HttpException } from "@nestjs/common";

export class EmailAlreadyExistsException extends HttpException {
  constructor() {
    super("Email already exists", 400);
  }
}

export class CannotRequestOtpException extends HttpException {
  constructor() {
    super("Cannot request otp", 400);
  }
}

export class InvalidOtpException extends HttpException {
  constructor() {
    super("Invalid otp", 400);
  }
}