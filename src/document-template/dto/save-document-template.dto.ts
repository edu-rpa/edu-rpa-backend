import { IsObject, IsNotEmpty } from 'class-validator';
import { Rectangle } from '../schema/document-template.schema';


export class SaveDocumentTemplateDto {
  size: {
    width: number;
    height: number;
  };

  @IsNotEmpty()
  isScanned: boolean;

  @IsObject()
  dataTemplate: {
    [label: string]: Rectangle;
  }
}