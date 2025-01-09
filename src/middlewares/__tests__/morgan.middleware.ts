import express from "express";
import request from "supertest";

import morganMiddleware from "../morgan.middleware";
import logger from "../../logger";

jest.mock("../../logger", () => ({
  http: jest.fn(),
  error: jest.fn(),
}));

const streamMock = {
  write: (message: string) => {
    const messageParts = message.split(" ");

    if (Number(messageParts[messageParts.length - 5]) >= 400) {
      logger.error(message.replace(/\n$/, ""));
      return;
    }

    logger.http(message.replace(/\n$/, ""));
  },
};

const skip = () => {
  const env = process.env.NODE_ENV || "test";
  return env !== "test";
};

describe("morgan middleware", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(morganMiddleware(streamMock, skip));

    app.get("/", (_req, res) => {
      res.send("Hello World");
    });

    app.get("/:param", (req, res) => {
      if (req.params.param === "test") {
        res.status(200).send(`Hello, ${req.params.param}`);
        return;
      }

      res.status(404);
      throw new Error(`Bad Request: ${req.params.param} not found`);
    });

    app.use(
      (
        err: Error,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
      ) => {
        if (res.statusCode === 200) res.status(500);

        res.send(err.message);
      },
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = "test";
  });

  it("should log a request with status code 200", async () => {
    const resp = await request(app).get("/");

    expect(resp.text).toBe("Hello World");
    expect(resp.status).toBe(200);
    expect(logger.http).toHaveBeenCalledTimes(1);
    expect(logger.error).not.toHaveBeenCalled();

    expect(logger.http).toHaveBeenCalledWith(
      expect.stringContaining("GET / 200"),
    );
  });

  it("should log an error request with a wrong method", async () => {
    const resp = await request(app).post("/");

    expect(resp.text).toBe(/* html */ `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot POST /</pre>
</body>
</html>
`);

    expect(resp.status).toBe(404);
    expect(logger.http).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledTimes(1);

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("POST / 404"),
    );
  });

  it("should skip logging in other environments", async () => {
    process.env.NODE_ENV = "production";

    const resp = await request(app).get("/");

    expect(resp.text).toBe("Hello World");
    expect(resp.status).toBe(200);
    expect(logger.http).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("should log an error request with a wrong path", async () => {
    const resp = await request(app).get("/error");

    expect(resp.text).toBe("Bad Request: error not found");
    expect(resp.status).toBe(404);
    expect(logger.http).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledTimes(1);

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("GET /error 404"),
    );
  });

  it("should log a request with status code 200 and a parameter", async () => {
    const resp = await request(app).get("/test");

    expect(resp.text).toBe("Hello, test");
    expect(resp.status).toBe(200);
    expect(logger.http).toHaveBeenCalledTimes(1);
    expect(logger.error).not.toHaveBeenCalled();

    expect(logger.http).toHaveBeenCalledWith(
      expect.stringContaining("GET /test 200"),
    );
  });
});
