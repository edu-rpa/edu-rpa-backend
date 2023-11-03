import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ActivityTemplate } from './activity-package.schema';
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum VariableType {
  CONNECTION_DRIVE = 'connection:Google Drive',
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  FILE = 'file',
} 

@Schema({
  minimize: false,
})
export class Process extends Document {
  @Prop()
  _id: number;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  // TODO: create a custom validator decorator to validate XML
  xml: string;

  @Prop({ 
    required: true,
    type: Object, 
  })
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  // TODO: create a custom validator decorator to validate variables
  variables: Variables;

  @Prop({ 
    required: true,
    type: [Object],
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested()
  // TODO: create a custom validator decorator to validate activities
  activities: Activity[];
}

export const ProcessSchema = SchemaFactory.createForClass(Process);

export interface Variables {
  [variableName: string]: Variable
}

export interface Variable {
  type: VariableType,
  isArgument: boolean,
  defaultValue: any, 
}

export class Activity extends ActivityTemplate {
  activityId: string;
  packageId: string;
}
