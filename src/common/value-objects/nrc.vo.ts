export class NrcNo {
  private readonly _value: string;
  private static readonly REGEX =
    /^(1[0-4]|[1-9])\/[A-Z]{3,9}\((N|T|P|E|Y|S)\)\d{6}$/;
  constructor(value: string) {
    this._value = value;
    Object.freeze(this);
  }
  public static create(nrc: string): NrcNo {
    if (!nrc) throw new Error('NRC number cannot be empty.');

    const cleanedNrc = nrc.replace(/\s+/g, '').toUpperCase();

    if (!NrcNo.REGEX.test(cleanedNrc))
      throw new Error(`Invalid NRC Format: ${nrc}`);

    return new NrcNo(cleanedNrc);
  }

  get value(): string {
    return this._value;
  }
  public parsedComponents() {
    const match = this.value.match(/^(\d+)\/([A-Z]+)\(([A-Z])\)(\d+)$/);
    if (!match) return null;
    return {
      stateCode: parseInt(match[1], 10),
      township: match[2],
      type: match[3],
      serialNumber: match[4],
    };
  }
  public equal(other: NrcNo): boolean {
    return this._value === other._value;
  }
}
