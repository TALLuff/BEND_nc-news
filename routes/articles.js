const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchArticleById,
  getArticleCommentsById,
  postArticleCommentById
} = require("../controllers/articles");

articlesRouter.get("/", getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleCommentsById)
  .post(postArticleCommentById);

module.exports = articlesRouter;
