const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics");
const { methodNotAllowed, routeNotFound } = require("../errors");

topicsRouter
  .route("/")
  .get(getTopics)
  .all(methodNotAllowed);

topicsRouter.route("/*").all(routeNotFound);

module.exports = topicsRouter;
