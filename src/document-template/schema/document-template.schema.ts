import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface Rectangle {
  left: number;
  top: number;
  right: number;
  bottom: number;
  label?: string;
};

@Schema()
export class DocumentTemplate extends Document {
  @Prop()
  _id: string;

  @Prop({ required: true })
  dataTemplate: Rectangle[];
}

export const DocumentTemplateSchema = SchemaFactory.createForClass(DocumentTemplate);
