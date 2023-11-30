import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProcessDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  xml: string;
}