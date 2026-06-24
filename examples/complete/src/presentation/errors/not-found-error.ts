export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`Not found: ${resource}`);
    this.name = 'NotFoundError';
  }
}
