const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const logger = require("../../Logger");
const Joi = require("joi");

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

const pathToBoardsFile = "./data/boards.json";

const boardSchema = Joi.object({
  name: Joi.string().required(),
  color: Joi.string(),
  description: Joi.string(),
  createdAt: Joi.string(),
});

const validateBody = (req, res, next) => {
  const { error } = boardSchema.validate(JSON.parse(req.body.data), {
    allowUnknown: true,
  });

  if (error) {
    logger.error(error.message);
  } else {
    next();
  }
};

const checkRole = (req, res, next) => {
  if (req.body.role === ROLES.ADMIN) {
    next();
  } else {
    logger.warn("You don't have permissions!");
    res.end("You don't have permissions!");
  }
};

router
  .route("/")
  .get(function (request, response) {
    fs.readFile(pathToData, "utf8", (err, data) => {
      if (err) {
        logger.error(err.message);
        return;
      }
      logger.info("Boards were successfully recieved");
      response.send(data);
    });
  })
  .post(
    urlencodedParser,
    validateBody,
    checkRole,
    function (request, response) {
      fs.readFile(pathToBoardsFile, "utf8", (err, data) => {
        if (err) {
          logger.error(err.message);
          return;
        }
        let json = JSON.parse(data);
        json.push(JSON.parse(request.body.data));

        fs.writeFile(
          pathToBoardsFile,
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
    }
  )
  .put(urlencodedParser, validateBody, checkRole, function (request, response) {
    fs.readFile(pathToBoardsFile, "utf8", (err, data) => {
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
        pathToBoardsFile,
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
  })
  .delete(urlencodedParser, function (request, response) {
    if (request.body.role === ROLES.ADMIN) {
      fs.readFile(pathToBoardsFile, "utf8", (err, data) => {
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
          pathToBoardsFile,
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
