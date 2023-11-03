import { IsObject, IsString, IsArray, IsNotEmpty } from 'class-validator';
import { Activity, Variables } from 'src/schemas/process.schema';

export class SaveProcessDto {
  @IsString()
  @IsNotEmpty()
  xml: string;

  @IsObject()
  @IsNotEmpty()
  variables: Variables;

  @IsArray()
  @IsNotEmpty()
  activities: Activity[];
}