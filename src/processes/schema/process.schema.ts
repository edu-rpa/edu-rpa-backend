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
  collection: 'processes',
})
export class ProcessDetail extends Document {
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

export const ProcessDetailSchema = SchemaFactory.createForClass(ProcessDetail);

export class ProcessForValidation {
  constructor(processDetail: ProcessDetail) {
    this._id = processDetail._id;
    this.xml = processDetail.xml;
    this.variables = processDetail.variables;
    this.activities = processDetail.activities;
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

// NOTE: the schema is set based on what is stored in the browser's local storage. It will be changed later.
export class Activity {
  activityID: string;
  activityType: string;
  properties: ActivityProperties;
}

export class ActivityProperties {
  activityPackage: string;
  serviceName: string;
  activityName: string;
  library: string;
  arguments: ActivityArguments;
  return: any;
}

export class ActivityArguments {
  [argumentName: string]: {
    keywordArg: string;
    value: any;
  };
}
