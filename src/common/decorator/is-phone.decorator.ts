import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

import { isPhoneNumber } from '@/common/utils/helper.util';

@ValidatorConstraint({ async: false })
export class IsPhoneNumberByCountryConstraint implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): boolean {
    if (typeof value !== 'string') return false;

    const defultCounty = validationArguments?.constraints[0] || 'VN';

    return isPhoneNumber(value, defultCounty);
  }
}

export function IsPhoneNumberByCountry(
  countryCode: string = 'VN', // Param quốc gia mặc định là 'VN'
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [countryCode.toUpperCase()],
      validator: IsPhoneNumberByCountryConstraint,
    });
  };
}
