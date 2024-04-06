import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';

@ValidatorConstraint({ name: 'isEnumArray', async: false })
export class IsEnumArrayConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const enumType = args.constraints[0];
    if (!Array.isArray(value)) {
      return false; // Return false if the provided value is not an array
    }
    return value.every(val => Object.values(enumType).includes(val));
    // Check if every value in the array is included in the enumType
  }

  defaultMessage(args: ValidationArguments) {
    return `$property must be an array of valid enum values`;
  }
}

export function IsEnumArray(enumType: any) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: { message: '$property must be an array of valid enum values' },
      constraints: [enumType],
      validator: IsEnumArrayConstraint,
    });
  };
}
