const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const helmet = require("helmet");
const fs = require("fs");
const logger = require("../Logger");

const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const app = express();
app.use(helmet());

app
  .route("/boards")
  .get(function (request, response) {
    fs.readFile("boards.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      response.send(data);
    });
  })
  .post(urlencodedParser, function (request, response) {
    if (request.body.role === ROLES.ADMIN) {
      fs.readFile("boards.json", "utf8", (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        let json = JSON.parse(data);
        json.push(JSON.parse(request.body.data));

        fs.writeFile(
          "boards.json",
          JSON.stringify(json),
          function (err, result) {
            if (err) console.log("error", err);
          }
        );
      });
      response.end("Board has been successfully added");
    } else {
      logger.info("You don't have permissions!");
      response.end("You don't have permissions!");
    }

    response.end();
  })
  .put(urlencodedParser, function (request, response) {
    if (request.body.role === ROLES.ADMIN) {
      fs.readFile("boards.json", "utf8", (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        let json = JSON.parse(data);
        const index = json.findIndex(
          item => item.name === JSON.parse(request.body.data).name
        );
        json[index] = JSON.parse(request.body.data);

        fs.writeFile(
          "boards.json",
          JSON.stringify(json),
          function (err, result) {
            if (err) console.log("error", err);
          }
        );
      });
      response.end("Board has been successfully updated");
    } else {
      response.end("You don't have permissions!");
    }
  })
  .delete(urlencodedParser, function (request, response) {
    fs.readFile("boards.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      let json = JSON.parse(data);
      const index = json.findIndex(
        item => item.name === JSON.parse(request.body.data).name
      );
      json.splice(index, 1);

      fs.writeFile("boards.json", JSON.stringify(json), function (err, result) {
        if (err) console.log("error", err);
      });
    });

    response.end();
  });

app
  .route("/cards")
  .get(function (request, response) {
    fs.readFile("cards.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      response.send(data);
    });
  })
  .post(urlencodedParser, function (request, response) {
    fs.readFile("cards.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      let json = JSON.parse(data);
      json.push(JSON.parse(request.body.data));

      fs.writeFile("cards.json", JSON.stringify(json), function (err, result) {
        if (err) console.log("error", err);
      });
    });

    response.end();
  })
  .put(urlencodedParser, function (request, response) {
    fs.readFile("cards.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      let json = JSON.parse(data);
      const index = json.findIndex(
        item => item.name === JSON.parse(request.body.data).name
      );
      json[index] = JSON.parse(request.body.data);

      fs.writeFile("cards.json", JSON.stringify(json), function (err, result) {
        if (err) console.log("error", err);
      });
    });

    response.end();
  })
  .delete(urlencodedParser, function (request, response) {
    fs.readFile("cards.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      let json = JSON.parse(data);
      const index = json.findIndex(
        item => item.name === JSON.parse(request.body.data).name
      );
      json.splice(index, 1);

      fs.writeFile("cards.json", JSON.stringify(json), function (err, result) {
        if (err) console.log("error", err);
      });
    });

    response.end();
  });

app.listen(3000);
