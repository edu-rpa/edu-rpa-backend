import { IsString, IsNotEmpty } from 'class-validator';
import { TriggerType } from '../entity/robot.entity';

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

  @IsString()
  @IsNotEmpty()
  triggerType: TriggerType;
}