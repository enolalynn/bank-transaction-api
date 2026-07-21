export class Money {
  constructor(public readonly amountInCent: number) {
    if (!Number.isInteger(amountInCent) || amountInCent < 0) {
      throw new Error('Invalid monetary amount');
    }
  }
  public toFormatted(): string {
    return (this.amountInCent / 100).toFixed(2);
  }
}
