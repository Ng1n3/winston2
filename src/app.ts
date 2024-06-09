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
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT);

const mongoOptions: MongoDBConnectionOptions = {
  db: 'mongodb://localhost:27017/logs',
  collection: "logs",
};

app.use(
  expressWinston.logger({
    transports: [
      new transports.Console(),
      new transports.File({ level: "warn", filename: "userWarning.log" }),
      new transports.File({ level: "error", filename: "userErrors.log" }),
      new MongoDB(mongoOptions),
    ],
    format: format.combine(
      format.json(),
      format.timestamp(),
      format.metadata(),
      format.prettyPrint()
    ),
    statusLevels: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send({ message: "hello world" });
});

app.get("/400", (req: Request, res: Response) => {
  res.status(400).send({ message: "warning" });
});

app.get("/500", (req: Request, res: Response) => {
  res.status(500).send({ message: "errors" });
});

app.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}`);
});
