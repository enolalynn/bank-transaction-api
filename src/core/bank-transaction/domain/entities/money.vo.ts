export class Money {
  constructor(public readonly amountInCent: number) {
    if (!Number.isInteger(amountInCent) || amountInCent < 0) {
      throw new Error('Invalid monetary amount');
    }
  }
  public static fromDecimal(amount: number): Money {
    return new Money(Math.round(amount * 100));
  }
  public toDecimal(): number {
    return this.amountInCent / 100;
  }

  public add(other: Money): Money {
    return new Money(this.amountInCent + other.amountInCent);
  }

  public substract(other: Money): Money {
    if (this.amountInCent < other.amountInCent) {
      throw new Error('Insufficient funds for substract');
    }
    return new Money(this.amountInCent - other.amountInCent);
  }

  public isGreaterThan(other: Money): boolean {
    return this.amountInCent > other.amountInCent;
  }
}
