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

const cardSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  createdAt: Joi.string(),
  estimate: Joi.string(),
  dueDate: Joi.string(),
  labels: Joi.array().items(Joi.string()),
});

const validateBody = body => {
  const { error } = cardSchema.validate(JSON.parse(body), {
    allowUnknown: true,
  });

  if (error) {
    logger.error(error.message);
  }
};

router
  .route("/")
  .get(function (request, response) {
    fs.readFile("./../cards.json", "utf8", (err, data) => {
      if (err) {
        logger.error(err.message);
        return;
      }
      logger.info("Cards were successfully recieved");
      response.send(data);
    });
  })
  .post(urlencodedParser, function (request, response) {
    validateBody(request.body.data);
    fs.readFile("./../cards.json", "utf8", (err, data) => {
      if (err) {
        logger.error(err.message);
        return;
      }
      let json = JSON.parse(data);
      json.push(JSON.parse(request.body.data));

      fs.writeFile(
        "./../cards.json",
        JSON.stringify(json),
        function (err, result) {
          if (err) {
            logger.error(err.message);
            response.end();
          }
          logger.info("Card has been successfully added");
          response.end("Card has been successfully added");
        }
      );
    });
  })
  .put(urlencodedParser, function (request, response) {
    fs.readFile("./../cards.json", "utf8", (err, data) => {
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
        "./../cards.json",
        JSON.stringify(json),
        function (err, result) {
          if (err) {
            logger.error(err.message);
            response.end();
          }
          logger.info("Card has been successfully updated");
          response.end("Card has been successfully updated");
        }
      );
    });
  })
  .delete(urlencodedParser, function (request, response) {
    fs.readFile("./../cards.json", "utf8", (err, data) => {
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
        "./../cards.json",
        JSON.stringify(json),
        function (err, result) {
          if (err) {
            logger.error(err.message);
            response.end();
          }
          logger.info("Card has been successfully deleted");
          response.end("Card has been successfully deleted");
        }
      );
    });
  });

module.exports = router;
