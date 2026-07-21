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
}
