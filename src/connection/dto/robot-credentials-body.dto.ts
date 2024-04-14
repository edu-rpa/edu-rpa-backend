import { ArrayMinSize, ArrayUnique, IsEnum, IsNotEmpty } from 'class-validator';
import { AuthorizationProvider } from '../entity/connection.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnumArray } from 'src/common/decorators';

export class GetUserCredentialBodyDto {
  @ArrayUnique()
  @IsEnumArray(AuthorizationProvider)
  @ApiProperty({ type: [String], enum: AuthorizationProvider, isArray: true, description: 'List of authorized providers' })
  providers: AuthorizationProvider[];
}