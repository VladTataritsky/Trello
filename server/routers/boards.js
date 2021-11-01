const express = require("express");
const bodyParser = require("body-parser");
const logger = require("../../Logger");
const Joi = require("joi");
const BoardsService = require("../services/boards");

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
    (async () => {
      try {
        const res = await BoardsService.getBoards(response);
        response.end(res);
        logger.info("Boards were successfully recieved");
      } catch (error) {
        logger.error(error.message);
        response.end();
      }
    })();
  })
  .post(
    urlencodedParser,
    validateBody,
    checkRole,
    function (request, response) {
      (async () => {
        try {
          await BoardsService.addBoard(request.body.data);
          logger.info("Board has been successfully added");
          response.end("Board has been successfully added");
        } catch (error) {
          logger.error(error.message);
        }
      })();
    }
  )
  .put(urlencodedParser, validateBody, checkRole, function (request, response) {
    (async () => {
      try {
        await BoardsService.updateBoard(request.body.data);
        logger.info("Board has been successfully updated");
        response.end("Board has been successfully updated");
      } catch (error) {
        logger.error(error.message);
      }
    })();
  })
  .delete(urlencodedParser, checkRole, function (request, response) {
    (async () => {
      try {
        await BoardsService.deleteBoard(request.body.data);
        logger.info("Board has been successfully deleted");
        response.end("Board has been successfully deleted");
      } catch (error) {
        logger.error(error.message);
      }
    })();
  });

module.exports = router;
