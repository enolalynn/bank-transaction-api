/* eslint-disable no-useless-escape */
export class PhoneNumber {
  private readonly _value: string;
  // Private constructor prevents direct instantiation with invalid data
  private constructor(value: string) {
    this._value = value;
    Object.freeze(this); // Guarantees immutability
  }

  public static create(rawPhone: string): PhoneNumber {
    if (!rawPhone || typeof rawPhone !== 'string') {
      throw new Error('Phone number must be a non-empty string.');
    }

    const sanitized = rawPhone.replace(/[\s\-\(\)\.]/g, '');

    const e164Regex = /^\+[1-9]\d{6,14}$/;

    if (!e164Regex.test(sanitized)) {
      throw new Error(
        `Invalid phone number format: "${rawPhone}". Must be in E.164 format (e.g., +14155552671).`,
      );
    }

    return new PhoneNumber(sanitized);
  }

  public get value(): string {
    return this._value;
  }

  public equals(other?: PhoneNumber): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof PhoneNumber)) {
      return false;
    }
    return this._value === other.value;
  }

  public formatInternational(): string {
    return this._value.replace(
      /^(\+\d{1,3})(\d{3})(\d{3})(\d{4})$/,
      '$1 $2 $3 $4',
    );
  }

  public toString(): string {
    return this._value;
  }
}
