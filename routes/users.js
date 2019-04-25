const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/users");
const { methodNotAllowed, routeNotFound } = require("../errors");

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(methodNotAllowed);

module.exports = usersRouter;
