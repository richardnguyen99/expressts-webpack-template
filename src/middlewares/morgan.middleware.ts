import morgan from "morgan";
import { logger } from "../logger";

const stream = {
  write: (message: string) => {
    logger.info(message.replace(/\n$/, ""));
  },
};

const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env === "test";
};

const morganMiddleware = morgan(
  ":remote-addr :method :url :status :res[content-length] - :response-time ms",
  { stream, skip }
);

export default morganMiddleware;
