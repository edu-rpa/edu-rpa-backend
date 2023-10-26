import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum TemplateType {
  ACTIVITY = 'activity',
  SUBPROCESS = 'subprocess',
  GATEWAY = 'gateway'
}

@Schema({
  collection: 'packages'
})
export class ActivityPackage extends Document {
  @Prop()
  _id: string;

  @Prop({ required: true })
  displayName: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  iconCode: string;

  @Prop({ required: true })
  activityTemplates: ActivityTemplate[];
}

export const ActivityPackageSchema = SchemaFactory.createForClass(ActivityPackage);

export class ActivityTemplate {
  templateId: string;
  displayName: string;
  description: string;
  iconCode: string;
  type: TemplateType;
  arguments: {
    [argumentName: string]: Argument
  };
  return: {
    [returnName: string]: string
  };
}

export interface Argument {
  type: string,
  value: any
}

export class ConnectionArgument implements Argument {
  type: `connection.${string}`;
  value: string;
}

export class VariableArgument implements Argument {
  type: `variable`;
  value: string;
}

export class StringArgument implements Argument {
  type: 'string';
  value: string;
}

export class NumberArgument implements Argument {
  type: 'number';
  value: number;
}

export class BooleanArgument implements Argument {
  type: 'boolean';
  value: boolean;
}

export class FileArgument implements Argument {
  type: 'file';
  value: string;
}

export class ExpressionArgument implements Argument {
  type: `expression.${string}`;
  value: any;
}

export class OperatorArgument implements Argument {
  type: `operator.${string}`;
  value: string;
}
