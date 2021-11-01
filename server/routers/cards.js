const express = require("express");
const bodyParser = require("body-parser");
const logger = require("../../Logger");
const Joi = require("joi");
const CardsService = require("../services/cards");

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

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
  .get(async function (request, response) {
    try {
      const res = await CardsService.getCards(response);
      response.end(res);
      logger.info("Cards were successfully recieved");
    } catch (error) {
      logger.error(error.message);
      response.end();
    }
  })
  .post(urlencodedParser, async function (request, response) {
    validateBody(request.body.data);
    try {
      await CardsService.addCard(request.body.data);
      logger.info("Cards has been successfully added");
      response.end("Cards has been successfully added");
    } catch (error) {
      logger.error(error.message);
    }
  })
  .put(urlencodedParser, async function (request, response) {
    try {
      await CardsService.updateCard(request.body.data);
      logger.info("Cards has been successfully updated");
      response.end("Cards has been successfully updated");
    } catch (error) {
      logger.error(error.message);
    }
  })
  .delete(urlencodedParser, async function (request, response) {
    try {
      await CardsService.deleteCard(request.body.data);
      logger.info("Cards has been successfully deleted");
      response.end("Cards has been successfully deleted");
    } catch (error) {
      logger.error(error.message);
    }
  });

module.exports = router;
