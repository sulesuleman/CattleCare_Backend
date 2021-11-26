const express = require("express");
const app = express();
const logging = require("./startup/logging");
const ip = require("ip");

logging();
require("./api/data/db.js")();
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/prod")(app);

const port = process.env.PORT || 5000;

logging.logger.info("Current Environment: " + process.env.NODE_ENV);

const server = app.listen(port, () =>
  logging.logger.info(
    `Cattle-Care-API listening on port ${port}! & ip: ${ip.address()}`
  )
);
