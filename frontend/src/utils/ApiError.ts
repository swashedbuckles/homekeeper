export class ApiError extends Error {
  statusCode: number;
  stack?: string | undefined;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
