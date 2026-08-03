export class NrcNo {
  constructor(private readonly value: string) {}
  public static create(nrc: string): NrcNo {
    if (!nrc) throw new Error('NRC number cannot be empty.');

    const cleanedNrc = nrc.replace(/\s+/g, '').toUpperCase();
    const nrcRegex = /^(1[0-4]|[1-9])\/[A-Z]{3,6}\((N|E|P|T|Y|S)\)\d{6}$/;

    if (!nrcRegex.test(cleanedNrc))
      throw new Error(`Invalid NRC Format: ${nrc}`);

    return new NrcNo(cleanedNrc);
  }

  public get getValue(): string {
    return this.value;
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
    return this.value === other.getValue;
  }
}
