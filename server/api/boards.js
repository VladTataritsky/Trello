const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const logger = require("../../Logger");
const Joi = require("joi");
require("dotenv").config();

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

const boardSchema = Joi.object({
  name: Joi.string().required(),
  color: Joi.string(),
  description: Joi.string(),
  createdAt: Joi.string(),
});

const validateBody = body => {
  const { error } = boardSchema.validate(JSON.parse(body), {
    allowUnknown: true,
  });

  if (error) {
    logger.error(error.message);
  }
};

router
  .route("/")
  .get(function (request, response) {
    fs.readFile("./../boards.json", "utf8", (err, data) => {
      if (err) {
        logger.error(err.message);
        return;
      }
      logger.info("Boards were successfully recieved");
      response.send(data);
    });
  })
  .post(urlencodedParser, function (request, response) {
    if (request.body.role === ROLES.ADMIN) {
      validateBody(request.body.data);
      fs.readFile("./../boards.json", "utf8", (err, data) => {
        if (err) {
          logger.error(err.message);
          return;
        }
        let json = JSON.parse(data);
        json.push(JSON.parse(request.body.data));

        fs.writeFile(
          "./../boards.json",
          JSON.stringify(json),
          function (err, result) {
            if (err) {
              logger.error(err.message);
              response.end();
            }
            logger.info("Board has been successfully added");
            response.end("Board has been successfully added");
          }
        );
      });
    } else {
      logger.warn("You don't have permissions!");
      response.end("You don't have permissions!");
    }
  })
  .put(urlencodedParser, function (request, response) {
    validateBody(request.body.data);
    if (request.body.role === ROLES.ADMIN) {
      validateBody(request.body.data);
      fs.readFile("./../boards.json", "utf8", (err, data) => {
        if (err) {
          logger.error(err.message);
          return;
        }
        let json = JSON.parse(data);
        const index = json.findIndex(
          item => item.name === JSON.parse(request.body.data).name
        );
        json[index] = JSON.parse(request.body.data);

        fs.writeFile(
          "./../boards.json",
          JSON.stringify(json),
          function (err, result) {
            if (err) {
              logger.error(err.message);
              response.end();
            }
            logger.info("Board has been successfully updated");
            response.end("Board has been successfully updated");
          }
        );
      });
    } else {
      logger.warn("You don't have permissions!");
      response.end("You don't have permissions!");
    }
  })
  .delete(urlencodedParser, function (request, response) {
    if (request.body.role === ROLES.ADMIN) {
      fs.readFile("./../boards.json", "utf8", (err, data) => {
        if (err) {
          logger.error(err.message);
          return;
        }
        let json = JSON.parse(data);
        const index = json.findIndex(
          item => item.name === JSON.parse(request.body.data).name
        );
        json.splice(index, 1);

        fs.writeFile(
          "./../boards.json",
          JSON.stringify(json),
          function (err, result) {
            if (err) {
              logger.error(err.message);
              response.end();
            }
            logger.info("Board has been successfully deleted");
            response.end("Board has been successfully deleted");
          }
        );
      });
    } else {
      logger.warn("You don't have permissions!");
      response.end("You don't have permissions!");
    }
  });

module.exports = router;
