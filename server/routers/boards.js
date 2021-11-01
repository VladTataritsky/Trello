const express = require("express");
const bodyParser = require("body-parser");
const logger = require("../../Logger");
const Joi = require("joi");
const BoardsService = require("../services/boards");
const checkRole = require("../middleware")

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });



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



router
  .route("/")
  .get(async function (request, response) {
    try {
      const res = await BoardsService.getBoards(response);
      response.end(res);
      logger.info("Boards were successfully recieved");
    } catch (error) {
      logger.error(error.message);
      response.end();
    }
  })
  .post(
    urlencodedParser,
    validateBody,
    checkRole,
    async function (request, response) {
      try {
        await BoardsService.addBoard(request.body.data);
        logger.info("Board has been successfully added");
        response.end("Board has been successfully added");
      } catch (error) {
        logger.error(error.message);
      }
    }
  )
  .put(
    urlencodedParser,
    validateBody,
    checkRole,
    async function (request, response) {
      try {
        await BoardsService.updateBoard(request.body.data);
        logger.info("Board has been successfully updated");
        response.end("Board has been successfully updated");
      } catch (error) {
        logger.error(error.message);
      }
    }
  )
  .delete(urlencodedParser, checkRole, async function (request, response) {
    try {
      await BoardsService.deleteBoard(request.body.data);
      logger.info("Board has been successfully deleted");
      response.end("Board has been successfully deleted");
    } catch (error) {
      logger.error(error.message);
    }
  });

module.exports = router;
