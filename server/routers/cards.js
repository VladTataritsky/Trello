const express = require("express");
const bodyParser = require("body-parser");
const logger = require("../../Logger");
const Joi = require("joi");
const cardsService = require("../services/cards");

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
  .get(function (request, response) {
    cardsService.getCards(request, response);
  })
  .post(urlencodedParser, function (request, response) {
    validateBody(request.body.data);
    cardsService.addCard(request, response);
  })
  .put(urlencodedParser, function (request, response) {
    cardsService.updateCard(request, response);
  })
  .delete(urlencodedParser, function (request, response) {
    cardsService.deleteCard(request, response);
  });

module.exports = router;
