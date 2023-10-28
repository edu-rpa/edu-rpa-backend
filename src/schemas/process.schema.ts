import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ActivityTemplate } from './activity-package.schema';

@Schema()
export class Process extends Document {
  @Prop({ required: true })
  variables: Variables;

  @Prop({ required: true })
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

