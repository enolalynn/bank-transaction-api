export class DomainException extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'DomainException';
  }
}
export class InsufficientFundException extends DomainException {
  constructor() {
    super(
      'INSUFFICEINT_FUNDS',
      'Sender balance is insufficent for this transfer',
    );
  }
}
export class InactiveAccountException extends DomainException {
  constructor() {
    super('INACTIVE_ACCOUNT', 'One or both accounts are inactive/frozen');
  }
}
export class InvalidTransferException extends DomainException {
  constructor(message: string) {
    super('INVALID_TRANSFER', message);
  }
}
