const express = require("express");
const helmet = require("helmet");
const boardsRouter = require("./routers/boards");
const cardsRouter = require("./routers/cards");

const app = express();

app.use(helmet());

app.use("/boards", boardsRouter);
app.use("/cards", cardsRouter);

app.listen(3000);
