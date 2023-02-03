import {
  registerDecorator,
  validate,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { validate as validUUID } from 'uuid';

@ValidatorConstraint({ name: 'IsUUIDorNull', async: true })
export class IsUUIDorNullConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return validUUID(value) || value === null;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} must be an UUID or null`;
  }
}

export function IsUUIDorNull(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUUIDorNullConstraint,
    });
  };
}
