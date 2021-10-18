const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const logger = require("../../Logger");
require("dotenv").config();

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const ROLES = {
  ADMIN: "admin",
  USER: "user",
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
