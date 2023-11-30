import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateProcessDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;
}