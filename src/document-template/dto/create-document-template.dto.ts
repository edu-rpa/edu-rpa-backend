import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { DocumentTemplateType } from '../entity/document-template.entity';

export class CreateDocumentTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsEnum(DocumentTemplateType)
  @IsNotEmpty()
  type: DocumentTemplateType;
}