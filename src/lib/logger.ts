// filepath: c:\Users\lucas\aten-psi\src\lib\logger.ts
import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "error" : "debug",
  format: format.combine(
    format.timestamp(),
    format.json(), // Logs em formato JSON
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;
