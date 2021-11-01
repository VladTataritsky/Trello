const logger = require("../Logger");

const ROLES = {
    ADMIN: "admin",
    USER: "user",
  };

const checkRole = (req, res, next) => {
  if (req.body.role === ROLES.ADMIN) {
    next();
  } else {
    logger.warn("You don't have permissions!");
    res.end("You don't have permissions!");
  }
};

module.exports = checkRole;
