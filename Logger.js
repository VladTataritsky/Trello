const { createLogger, format, transports } = require("winston");
require("dotenv").config({ path: __dirname + "/.env" });

const logger = createLogger();

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
        format.align(),
        format.printf(
          info => `${info.level}: ${[info.timestamp]}: ${info.message}`
        )
      ),
    })
  );
} else {
  logger.add(
    new transports.File({
      filename: "./../logs/server.log",
      format: format.combine(
        format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
        format.align(),
        format.printf(
          info => `${info.level}: ${[info.timestamp]}: ${info.message}`
        )
      ),
    })
  );
}

module.exports = logger;
