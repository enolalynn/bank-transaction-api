export class Email {
  private readonly _value: string;
  private static readonly REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(value: string) {
    this._value = value;
    Object.freeze(this);
  }
  public static create(email: string): Email {
    if (!Email.REGEX.test(email))
      throw new Error(`Invalid email format: ${email}`);

    return new Email(email.toLowerCase());
  }
  get value(): string {
    return this._value;
  }
}
