class ExpressError extends Error {
  private _status: number;
  private _message: string;

  constructor(message?: string, status?: number) {
    super();
    this._message = message || "Internal Server Error";
    this._status = status || 500;
  }

  public get status() {
    return this._status;
  }

  public set status(status: number) {
    this._status = status;
  }

  public get message() {
    return this._message;
  }

  public set message(message: string) {
    this._message = message;
  }
}

export default ExpressError;
