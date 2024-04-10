import { ArrayMinSize, ArrayUnique, IsEnum, IsNotEmpty } from 'class-validator';
import { AuthorizationProvider } from '../entity/connection.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnumArray } from 'src/common/decorators';

export class GetUserCredentialBodyDto {
  @IsNotEmpty()
  @ApiProperty({ type: Number, description: 'User ID' })
  userId: number;

  @IsNotEmpty()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsEnumArray(AuthorizationProvider)
  @ApiProperty({ type: [String], enum: AuthorizationProvider, isArray: true, description: 'List of authorized providers' })
  providers: AuthorizationProvider[];
}