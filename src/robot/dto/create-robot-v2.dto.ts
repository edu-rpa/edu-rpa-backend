import { IsString, IsNotEmpty, ArrayMinSize, ArrayUnique } from 'class-validator';
import { TriggerType } from '../entity/robot.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnumArray } from 'src/common/decorators';
import { AuthorizationProvider } from 'src/connection/entity/connection.entity';
import { CreateRobotDto } from './create-robot.dto';

export interface CreateRobotProvider {
  provider?: AuthorizationProvider,
  connectionKey: string
} 

export class CreateRobotDtoV2 {
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
  
  @ApiProperty({ type: [Object], isArray: true, description: 'List of authorized providers' })
  providers?: CreateRobotProvider[];

}