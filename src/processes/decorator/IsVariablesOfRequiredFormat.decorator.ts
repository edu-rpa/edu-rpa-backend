import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsVariablesOfRequiredFormat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isVariablesOfRequiredFormat',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isVariablesOfRequiredFormat(value);
        },
      },
    });
  };
}

function isVariablesOfRequiredFormat(variables: any) {
  if (typeof variables !== 'object') return false;
  for (const variableName in variables) {
    const variable = variables[variableName];
    if (!isValidVariable(variable)) return false;
  }
  return true;
}

function isValidVariable(variable: any) {
  if (typeof variable !== 'object') return false;
  if (typeof variable.type !== 'string') return false;
  if (typeof variable.isArgument !== 'boolean') return false;
  return true;
}