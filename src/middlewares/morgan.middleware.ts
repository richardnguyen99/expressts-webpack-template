import morgan from "morgan";

const morganMiddleware = (stream: morgan.StreamOptions, skip: () => boolean) =>
  morgan(
    ":remote-addr :method :url :status :res[content-length] - :response-time ms",
    { stream, skip },
  );

export default morganMiddleware;
