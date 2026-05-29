import winston from "winston";

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "warn" : "debug",

  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // log stack traces
    logFormat
  ),

  transports: [
    // Console — always on
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),

    // Error log file — only errors
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    // Combined log file — everything
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

export default logger;
