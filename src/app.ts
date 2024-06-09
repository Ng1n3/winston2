import express, { Request, Response } from "express";
import dotenv from "dotenv";
import expressWinston from "express-winston";
import { error, format, level, transports } from "winston";
import "winston-mongodb";
import {
  MongoDBTransportInstance,
  MongoDB,
  MongoDBConnectionOptions,
} from "winston-mongodb";
import logger from "./logger";
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT);

// const mongoOptions: MongoDBConnectionOptions = {
//   db: 'mongodb://localhost:27017/logs',
//   collection: "logs",
// };

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    statusLevels: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  logger.info("THis is an info log")
  res.status(200).send({ message: "hello world" });
});

app.get("/400", (req: Request, res: Response) => {
  logger.warn("This is a warn log")
  res.status(400).send({ message: "warning" });
});

app.get("/500", (req: Request, res: Response) => {
  res.status(500).send({ message: "errors" });
});

app.get("/error", (req: Request, res: Response) => {
  throw new Error("THis is a custom error");
});

const myFormat = format.printf(({ level, meta, timestamp }) => {
  return `${timestamp} ${level} ${meta.message}`;
});

app.use(
  expressWinston.errorLogger({
    transports: [
      new transports.File({
        filename: "LogsInternalErrors.log",
      }),
    ],
    format: format.combine(
      format.json(),
      format.timestamp(),
      format.colorize({ all: true }),
      myFormat
    ),
  })
);

app.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}`);
});
