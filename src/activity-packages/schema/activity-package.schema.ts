import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ScalarType, VariableType } from 'src/processes/schema/process.schema';

export enum TemplateType {
  ACTIVITY = 'activity',
  SUBPROCESS = 'subprocess',
  GATEWAY = 'gateway'
}

export enum SpecialArgumentType {
  VARIABLE = 'variable',
  EXPRESSION_LOGIC = 'expression.logic',
  EXPRESSION_ARITHMETIC = 'expression.arithmetic',
  OPERATOR_LOGIC = 'operator.logic',
  OPERATOR_ARITHMETIC = 'operator.arithmetic'
}

export type ArgumentType = VariableType | SpecialArgumentType;

export type SubsetExtends<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
}

export type SubsetExcludes<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
}

@Schema({
  collection: 'activity_packages'
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
  type: ArgumentType,
  value: any
}

export class ConnectionArgument implements Argument {
  type: SubsetExtends<ArgumentType, 'connection'>;
  value: string;
}

export class VariableArgument implements Argument {
  type: SpecialArgumentType.VARIABLE;
  value: string;
}

export class StringArgument implements Argument {
  type: VariableType.STRING;
  value: string;
}

export class NumberArgument implements Argument {
  type: VariableType.NUMBER;
  value: number;
}

export class BooleanArgument implements Argument {
  type: VariableType.BOOLEAN;
  value: boolean;
}

export class FileArgument implements Argument {
  type: VariableType.FILE;
  value: string;
}

export class ExpressionArgument implements Argument {
  type: SubsetExtends<ArgumentType, 'expression'>;
  value: any;
}

export class OperatorArgument implements Argument {
  type: SubsetExtends<ArgumentType, 'operator'>;
  value: string;
}

export abstract class ScalarArgument implements Argument {
  type: ScalarType;
  value: any;
}

export class ListArgument implements Argument {
  type: VariableType.LIST;
  value: ScalarArgument[];
}

export class DictionaryArgument implements Argument {
  type: VariableType.DICTIONARY;
  value: {
    [key: string]: ScalarArgument
  };
}
