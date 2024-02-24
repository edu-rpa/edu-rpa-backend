import { IsObject, IsNotEmpty } from 'class-validator';
import { Rectangle } from '../schema/document-template.schema';


export class SaveDocumentTemplateDto {
  @IsObject()
  dataTemplate: {
    [label: string]: Rectangle;
  }
}