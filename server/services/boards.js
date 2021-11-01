const fs = require("fs").promises;

const pathToBoardsFile = "./data/boards.json";

class BoardsService {
  static async getBoards() {
    return await fs.readFile(pathToBoardsFile, "utf8");
  }

  static async addBoard(body) {
    await fs.readFile(pathToBoardsFile, "utf8").then(data => {
      let json = JSON.parse(data);
      json.push(JSON.parse(body));

      fs.writeFile(pathToBoardsFile, JSON.stringify(json));
    });
  }

  static async updateBoard(body) {
    await fs.readFile(pathToBoardsFile, "utf8").then(data => {
      let json = JSON.parse(data);
      const index = json.findIndex(item => item.name === JSON.parse(body).name);
      json[index] = JSON.parse(body);

      fs.writeFile(pathToBoardsFile, JSON.stringify(json));
    });
  }

  static async deleteBoard(body) {
    await fs.readFile(pathToBoardsFile, "utf8").then(data => {
      let json = JSON.parse(data);
      const index = json.findIndex(item => item.name === JSON.parse(body).name);
      json.splice(index, 1);

      fs.writeFile(pathToBoardsFile, JSON.stringify(json));
    });
  }
}

module.exports = BoardsService;
