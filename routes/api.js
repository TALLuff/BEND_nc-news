const apiRouter = require("express").Router();
const { methodNotAllowed, routeNotFound } = require("../errors");
const articlesRouter = require("./articles");
const commentsRouter = require("./comments");
const topicsRouter = require("./topics");
const usersRouter = require("./users");
const { endpoints } = require("../endpoints");

apiRouter
  .route("/")
  .get((req, res) => res.send(endpoints))
  .all(methodNotAllowed);

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);

apiRouter.route("/*").all(routeNotFound);

module.exports = apiRouter;
