import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class Rectangle {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

@Schema({
  collection: 'document_templates',
  minimize: false,
})
export class DocumentTemplateDetail extends Document {
  @Prop()
  _id: string;

  @Prop({required: false, type: Object})
  size: {
    width: number;
    height: number;
  };

  @Prop({required: false, type: Boolean, default: false})
  isScanned: boolean;

  @Prop({required: true, type: Object, default: {}})
  dataTemplate: {
    [label: string]: Rectangle;
  }
}

export const DocumentTemplateDetailSchema = SchemaFactory.createForClass(DocumentTemplateDetail);
