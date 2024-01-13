import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class Rectangle {
  left: number;
  top: number;
  right: number;
  bottom: number;
  label?: string;
};

@Schema({
  collection: 'document_templates'
})
export class DocumentTemplateDetail extends Document {
  @Prop()
  _id: string;

  @Prop({ required: true })
  dataTemplate: Rectangle[];
}

export const DocumentTemplateDetailSchema = SchemaFactory.createForClass(DocumentTemplateDetail);
