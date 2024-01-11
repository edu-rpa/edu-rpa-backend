import { IsArray, IsNotEmpty } from 'class-validator';
import { Rectangle } from '../schema/document-template.schema';


export class SaveDocumentTemplateDto {
  @IsArray()
  @IsNotEmpty()
  dataTemplate: Rectangle[];
}