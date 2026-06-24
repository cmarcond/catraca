export class InvalidParamError extends Error {
  constructor(paramName: string, reason: string) {
    super(`Invalid param: ${paramName} (${reason})`);
    this.name = 'InvalidParamError';
  }
}
