import { createLogger, format, transports } from "winston";

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ level: "warn", filename: "userWarning.log" }),
    new transports.File({ level: "error", filename: "userErrors.log" }),
    // new MongoDB(mongoOptions),
  ],
  format: format.combine(
    format.json(),
    format.timestamp(),
    format.metadata(),
    format.prettyPrint()
  ),
});

export default logger;
