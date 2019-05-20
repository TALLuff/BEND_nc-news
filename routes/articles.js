const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchArticleById,
  getArticleCommentsById,
  postArticleCommentById,
  postArticle,
  deleteArticleById
} = require("../controllers/articles");
const { methodNotAllowed, routeNotFound } = require("../errors");

articlesRouter
  .route("/")
  .get(getArticles)
  .post(postArticle)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleCommentsById)
  .post(postArticleCommentById)
  .all(methodNotAllowed);

module.exports = articlesRouter;
