import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateDocumentTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;
}