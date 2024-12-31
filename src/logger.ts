import winston from "winston";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const isDevelopment = () => {
  const env = process.env.NODE_ENV || "development";
  return env === "development";
};

const level = () => {
  return isDevelopment() ? "debug" : "http";
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

const format = winston.format.combine(
  // Add the message timestamp with the preferred format
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  // Tell Winston that the logs must be colored
  winston.format.colorize(),
  // Define the format of the message showing the timestamp, the level and the message
  winston.format.printf((info) =>
    isDevelopment()
      ? `${info.timestamp} ${info.level}: ${info.message}`
      : `${info.message}`
  )
);

winston.addColors(colors);

const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports: [
    new winston.transports.File({
      filename: "error.log",
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.uncolorize(),
      ),
    }),
    new winston.transports.Console(),
  ],
});

export { logger };
