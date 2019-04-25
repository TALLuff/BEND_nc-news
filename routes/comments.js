const commentsRouter = require("express").Router();
const {
  patchCommentById,
  deleteCommentById
} = require("../controllers/comments");
const { methodNotAllowed, routeNotFound } = require("../errors");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(methodNotAllowed);

commentsRouter.route("/*").all(routeNotFound);

module.exports = commentsRouter;
