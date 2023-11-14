import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsActivitiesOfRequiredFormat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isActivitiesOfRequiredFormat',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isActivitiesOfRequiredFormat(value);
        },
      },
    });
  };
}

function isActivitiesOfRequiredFormat(activities: any) {
  if (!Array.isArray(activities)) return false;
  for (const activity of activities) {
    if (!isActivityOfRequiredFormat(activity)) return false;
  }
  return true;
}

function isActivityOfRequiredFormat(activity: any) {
  if (typeof activity !== 'object') return false;
  if (typeof activity.packageId !== 'string') return false;
  if (typeof activity.templateId !== 'string') return false;
  if (typeof activity.activityId !== 'string') return false;
  return isArgumentsOfRequiredFormat(activity.arguments) && isReturnOfRequiredFormat(activity.return);
}

function isArgumentsOfRequiredFormat(argumentsObject: any) {
  if (typeof argumentsObject !== 'object') return false;
  for (const argumentName in argumentsObject) {
    const argument = argumentsObject[argumentName];
    if (!isArgumentOfRequiredFormat(argument)) return false;
  }
  return true;
}

function isArgumentOfRequiredFormat(argument: any) {
  if (typeof argument !== 'object') return false;
  if (typeof argument.type !== 'string') return false;
  return true;
}

function isReturnOfRequiredFormat(returnObject: any) {
  if (typeof returnObject !== 'object') return false;
  for (const returnName in returnObject) {
    const variableName = returnObject[returnName];
    if (variableName && typeof variableName !== 'string') return false;
  }
  return true;
}
