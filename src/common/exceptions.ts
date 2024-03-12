import { BadRequestException, HttpException } from "@nestjs/common";

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

export class InvalidStateException extends HttpException {
  constructor() {
    super("Invalid state", 400);
  }
}

export class UnableToCreateConnectionException extends HttpException {
  constructor() {
    super("Unable to create connection", 400);
  }
}

export class UnableToCreateProcessException extends HttpException {
  constructor() {
    super("Unable to create process", 400);
  }
}

export class ProcessValidationFailedException extends BadRequestException {
  constructor(description: string) {
    super("Failed to validate process", {
      cause: new Error(),
      description,
    });
  }
}

export class ProcessNotFoundException extends HttpException {
  constructor() {
    super("Process not found", 404);
  }
}

export class DocumentTemplateNotFoundException extends HttpException {
  constructor() {
    super("Document template not found", 404);
  }
}

export class ConnectionNotFoundException extends HttpException {
  constructor() {
    super("Connection not found", 404);
  }
}

export class RobotNotFoundException extends HttpException {
  constructor() {
    super("Robot not found", 404);
  }
}

export class UserNotFoundException extends HttpException {
  constructor() {
    super("User not found", 404);
  }
}

export class FileTooLargeException extends HttpException {
  constructor() {
    super("File too large", 400);
  }
}

export class CannotRefreshToken extends HttpException {
  constructor() {
    super("Cannot refresh token", 400);
  }
}