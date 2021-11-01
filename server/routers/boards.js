const express = require("express");
const bodyParser = require("body-parser");
const logger = require("../../Logger");
const Joi = require("joi");
const boardsService = require("../services/boards");

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
    boardsService.getBoards(request, response);
  })
  .post(
    urlencodedParser,
    validateBody,
    checkRole,
    function (request, response) {
      boardsService.addBoard(request, response);
    }
  )
  .put(urlencodedParser, validateBody, checkRole, function (request, response) {
    boardsService.updateBoard(request, response);
  })
  .delete(urlencodedParser, checkRole, function (request, response) {
    boardsService.deleteBoard(request, response);
  });

module.exports = router;
