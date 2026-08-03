export class Email {
  constructor(private readonly value: string) {}
  public static create(email: string): Email {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      throw new Error(`Invalid email format: ${email}`);

    return new Email(email.toLowerCase());
  }
  getValue(): string {
    return this.value;
  }
}
