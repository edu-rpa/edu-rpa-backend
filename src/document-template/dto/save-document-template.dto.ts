import { IsObject, IsNotEmpty } from 'class-validator';
import { Rectangle } from '../schema/document-template.schema';


export class SaveDocumentTemplateDto {
  size: {
    width: number;
    height: number;
  };

  @IsObject()
  dataTemplate: {
    [label: string]: Rectangle;
  }
}