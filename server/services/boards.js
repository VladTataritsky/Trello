const fs = require("fs");
const logger = require("../../Logger");

const pathToBoardsFile = "./data/boards.json";

class boardsService {
  static getBoards(request, response) {
    fs.readFile(pathToBoardsFile, "utf8", (err, data) => {
      if (err) {
        logger.error(err.message);
        return;
      }
      logger.info("Boards were successfully recieved");
      response.send(data);
    });
  }

  static addBoard(request, response) {
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

  static updateBoard(request, response) {
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
  }

  static deleteBoard(request, response) {
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
  }
}

module.exports = boardsService;
