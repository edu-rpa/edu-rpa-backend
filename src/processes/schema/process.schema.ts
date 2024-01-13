import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ActivityTemplate } from 'src/activity-packages/schema/activity-package.schema';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';
import {
  IsVariablesOfRequiredFormat
} from '../decorator/IsVariablesOfRequiredFormat.decorator';
import {
  IsActivitiesOfRequiredFormat
} from '../decorator/IsActivitiesOfRequiredFormat.decorator';

export enum VariableType {
  CONNECTION_DRIVE = 'connection.Google Drive',
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  FILE = 'file',
  LIST = 'list',
  DICTIONARY = 'dictionary',
}

export type ScalarType = Extract<VariableType, 'string' | 'number' | 'boolean' | 'file'>;

@Schema({
  minimize: false,
})
export class Process extends Document {
  @Prop()
  _id: string;

  @Prop({
    required: true,
    type: String,
  })
  xml: string;

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

export class ProcessForValidation {
  constructor(process: Process) {
    this._id = process._id;
    this.xml = process.xml;
    this.variables = process.variables;
    this.activities = process.activities;
  }

  _id: string;

  @IsString()
  @IsNotEmpty()
  // TODO: create a custom validator decorator to validate XML
  xml: string;

  @IsVariablesOfRequiredFormat()
  variables: Variables;

  @IsActivitiesOfRequiredFormat()
  activities: Activity[];
}

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
