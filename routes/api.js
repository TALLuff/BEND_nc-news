const apiRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const articlesRouter = require("./articles");
const commentsRouter = require("./comments");
const topicsRouter = require("./topics");
const usersRouter = require("./users");

apiRouter
  .route("/")
  .get((req, res) => res.send({ ok: true }))
  .all(methodNotAllowed);

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
