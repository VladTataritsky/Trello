const fs = require("fs");

const pathCardsFile = "./data/cards.json";

class CardsService {
  static async getCards() {
    return await fs.readFile(pathCardsFile, "utf8");
  }

  static async addCard(body) {
    await fs.readFile(pathCardsFile, "utf8").then(data => {
      let json = JSON.parse(data);
      json.push(JSON.parse(body));

      fs.writeFile(pathCardsFile, JSON.stringify(json));
    });
  }

  static async updateCard(body) {
    await fs.readFile(pathCardsFile, "utf8").then(data => {
      let json = JSON.parse(data);
      const index = json.findIndex(item => item.name === JSON.parse(body).name);
      json[index] = JSON.parse(body);

      fs.writeFile(pathCardsFile, JSON.stringify(json));
    });
  }

  static async deleteCard(body) {
    await fs.readFile(pathCardsFile, "utf8").then(data => {
      let json = JSON.parse(data);
      const index = json.findIndex(item => item.name === JSON.parse(body).name);
      json.splice(index, 1);

      fs.writeFile(pathCardsFile, JSON.stringify(json));
    });
  }
}

module.exports = CardsService;
