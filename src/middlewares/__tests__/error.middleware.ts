import express from "express";
import request from "supertest";

import * as ErrorMiddleware from "../error.middleware";
import errorHandler from "../error.middleware";
import ExpressError from "../../error";

const errorTemplate = (data: ErrorMiddleware.LocalObjs) => {
  let mainError: string;

  if (data.statusCode >= 400 && data.statusCode < 500) {
    mainError = "Client Error";
  } else {
    mainError = "Server Error";
  }

  return /*html*/ `<!DOCTYPE html>
<html lang="en">
<head>
  <title>${data.title}</title>
</head>
<body>
  <h1>${mainError}: ${data.statusCode}</h1>
  <h2>${data.title}</h2>
  <p>${data.message}</p>
</body>
</html>
`;
};

const cb = jest.fn(
  (
    _req: Parameters<ErrorMiddleware.ErrorHandler>[0],
    res: Parameters<ErrorMiddleware.ErrorHandler>[1],
    _next: Parameters<ErrorMiddleware.ErrorHandler>[2],
  ) => {
    res
      .status(res.locals.statusCode)
      .header("Content-Type", "text/html")
      .send(errorTemplate(res.locals));
  },
);

describe("error middleware", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();

    app.get("/", (_req, res) => {
      res.send("Hello World");
    });

    app.get("/error", (_req, _res, next) => {
      next(new Error("Test Error"));
    });

    app.get("/throw-error", (_req, _res, _next) => {
      throw new ExpressError("Test Error", 500);
    });

    app.use("*", (req, _res, next) => {
      if (req.method === "GET") {
        next(new ExpressError(`Not Found: GET ${req.originalUrl}`, 404));
        return;
      }

      if (req.method !== "GET") {
        next(
          new ExpressError(
            `Method ${req.method} is not allowed at ${req.originalUrl}`,
            405,
          ),
        );
      }

      next(new ExpressError("Bad Request", 400));
    });

    app.use(errorHandler(cb));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render a 404 error template", async () => {
    const response = await request(app).get("/not-found");

    expect(response.status).toBe(404);
    expect(response.text).toBe(/* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Not Found</title>
</head>
<body>
  <h1>Client Error: 404</h1>
  <h2>Not Found</h2>
  <p>Not Found: GET /not-found</p>
</body>
</html>
`);
  });

  it("should render a 405 error template", async () => {
    const response = await request(app).post("/");

    expect(response.status).toBe(405);
    expect(response.text).toBe(/* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Method Not Allowed</title>
</head>
<body>
  <h1>Client Error: 405</h1>
  <h2>Method Not Allowed</h2>
  <p>Method POST is not allowed at /</p>
</body>
</html>
`);
  });

  it("should render a 500 error template", async () => {
    const response = await request(app).get("/error");

    expect(cb).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(500);
    expect(response.text).toBe(/* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Internal Server Error</title>
</head>
<body>
  <h1>Server Error: 500</h1>
  <h2>Internal Server Error</h2>
  <p>Test Error</p>
</body>
</html>
`);
  });

  it("should render a 500 error template with throw", async () => {
    const response = await request(app).get("/throw-error");

    expect(cb).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(500);
    expect(response.text).toBe(/* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Internal Server Error</title>
</head>
<body>
  <h1>Server Error: 500</h1>
  <h2>Internal Server Error</h2>
  <p>Test Error</p>
</body>
</html>
`);
  });
});
