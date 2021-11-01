const fs = require("fs");
const logger = require("../../Logger");

const pathCardsFile = "./data/cards.json";

class cardsService {
  static getCards(request, response) {
    fs.readFile(pathCardsFile, "utf8", (err, data) => {
      if (err) {
        logger.error(err.message);
        return;
      }
      logger.info("Cards were successfully recieved");
      response.send(data);
    });
  }

  static addCard(request, response) {
    fs.readFile(pathCardsFile, "utf8", (err, data) => {
      if (err) {
        logger.error(err.message);
        return;
      }
      let json = JSON.parse(data);
      json.push(JSON.parse(request.body.data));

      fs.writeFile(pathCardsFile, JSON.stringify(json), function (err, result) {
        if (err) {
          logger.error(err.message);
          response.end();
        }
        logger.info("Card has been successfully added");
        response.end("Card has been successfully added");
      });
    });
  }

  static updateCard(request, response) {
    fs.readFile(pathCardsFile, "utf8", (err, data) => {
      if (err) {
        logger.error(err.message);
        return;
      }
      let json = JSON.parse(data);
      const index = json.findIndex(
        item => item.name === JSON.parse(request.body.data).name
      );
      json[index] = JSON.parse(request.body.data);

      fs.writeFile(pathCardsFile, JSON.stringify(json), function (err, result) {
        if (err) {
          logger.error(err.message);
          response.end();
        }
        logger.info("Card has been successfully updated");
        response.end("Card has been successfully updated");
      });
    });
  }

  static deleteCard(request, response) {
    fs.readFile(pathCardsFile, "utf8", (err, data) => {
      if (err) {
        logger.error(err.message);
        return;
      }
      let json = JSON.parse(data);
      const index = json.findIndex(
        item => item.name === JSON.parse(request.body.data).name
      );
      json.splice(index, 1);

      fs.writeFile(pathCardsFile, JSON.stringify(json), function (err, result) {
        if (err) {
          logger.error(err.message);
          response.end();
        }
        logger.info("Card has been successfully deleted");
        response.end("Card has been successfully deleted");
      });
    });
  }
}

module.exports = cardsService;
