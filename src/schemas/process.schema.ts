import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ActivityTemplate } from './activity-package.schema';

@Schema()
export class Process extends Document {
  @Prop()
  _id: number;

  @Prop({ 
    required: true,
    type: Object, 
  })
  variables: Variables;

  @Prop({ 
    required: true,
    type: [Object],
  })
  activities: Activity[];
}

export const ProcessSchema = SchemaFactory.createForClass(Process);

export interface Variables {
  [variableName: string]: Variable
}

export interface Variable {
  type: string,
  isArgument: boolean,
  defaultValue: any, 
}

export class Activity extends ActivityTemplate {
  activityId: string;
  packageId: string;
  prev: string[];
  next: null | string | IfNext;
}

export interface IfNext {
  true: string;
  false: string;
}

