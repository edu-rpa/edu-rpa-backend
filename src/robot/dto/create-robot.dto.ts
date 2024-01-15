import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRobotDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  processId: string;

  // RobotFramework code (JSON format, stringified)
  @IsString()
  @IsNotEmpty()
  code: string;
}