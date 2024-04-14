import { ArrayMinSize, ArrayUnique, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { AuthorizationProvider } from '../entity/connection.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnumArray } from 'src/common/decorators';
import { Optional } from '@nestjs/common';

export class GetUserCredentialWithRobotVersionBodyDto {
  @IsNotEmpty()
  @ApiProperty({ type: Number, description: 'User ID' })
  userId: number;

  @IsNotEmpty()
  @ApiProperty({ type: Number, description: 'Process ID' })
  processId: string;

  @IsNotEmpty()
  @ApiProperty({ type: Number, description: 'Process Version' })
  processVersion: number;

  @Optional()
  @ApiProperty({ type: Number, description: 'Limit' })
  limit?: number;

  @Optional()
  @ApiProperty({ type: Number, description: 'Offset' })
  offset?: number;
}