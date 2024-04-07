import { IsString, IsNotEmpty, ArrayMinSize, ArrayUnique } from 'class-validator';
import { TriggerType } from '../entity/robot.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnumArray } from 'src/common/decorators';
import { AuthorizationProvider } from 'src/connection/entity/connection.entity';

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

  @ApiProperty({ type: [String], enum: AuthorizationProvider, isArray: true, description: 'List of authorized providers' })
  providers?: AuthorizationProvider[];
}