const express = require("express");
const helmet = require("helmet");
const boardsRouter = require("./api/boards");
const cardsRouter = require("./api/cards");

const app = express();

app.use(helmet());

app.use("/boards", boardsRouter);
app.use("/cards", cardsRouter);

app.listen(3000);
