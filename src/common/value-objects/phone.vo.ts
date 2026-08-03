/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  CountryCode,
  parsePhoneNumberWithError,
  PhoneNumber,
} from 'libphonenumber-js';

export class PhoneNo {
  private readonly _e164Value: string;
  private readonly _countryCode?: CountryCode;
  private constructor(e164Value: string, countryCode?: CountryCode) {
    this._e164Value = e164Value;
    this._countryCode = countryCode;
    Object.freeze(this);
  }

  public static create(
    rawValue: string,
    defaultCountry?: CountryCode,
  ): PhoneNo {
    if (!rawValue || typeof rawValue !== 'string')
      throw new Error(`Phone number must be a non-empty string`);

    try {
      const parsedNumber: PhoneNumber = parsePhoneNumberWithError(
        rawValue,
        defaultCountry,
      );
      if (!parsedNumber.isValid())
        throw new Error(`Invalid phone number structure: ${rawValue}`);

      return new PhoneNo(parsedNumber.number, parsedNumber.country);
    } catch (error) {
      throw new Error(`Invalid phone number '${rawValue}': ${error.message}`);
    }
  }
  public get value(): string {
    return this._e164Value;
  }
  public get countryCode(): CountryCode | undefined {
    return this._countryCode;
  }
  public format(
    type: 'E.164' | 'NATIONAL' | 'INTERNATIONAL' = 'E.164',
  ): string {
    const parsed = parsePhoneNumberWithError(this._e164Value);
    return parsed.format(type);
  }

  public equals(other: PhoneNo | null | undefined): boolean {
    if (!(other instanceof PhoneNo)) {
      return false;
    }
    return this._e164Value === other._e164Value;
  }
  public toString(): string {
    return this._e164Value;
  }
}
