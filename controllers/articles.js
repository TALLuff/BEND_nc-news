const {
  fetchArticles,
  fetchArticleById,
  updateArticleById,
  fetchArticleCommentsById,
  createArticleCommentById
} = require("../models/articles");

exports.getArticles = (req, res, next) => {
  const { author, topic, sort_by, order } = req.query;
  fetchArticles(author, topic, sort_by, order)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(article => {
      res.status(200).send({ article: article[0] });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then(updatedArticle => {
      res.status(200).send({ article: updatedArticle[0] });
    })
    .catch(next);
};

exports.getArticleCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  fetchArticleCommentsById(article_id, sort_by, order)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postArticleCommentById = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  createArticleCommentById(article_id, username, body)
    .then(comment => {
      res.status(201).send({ comment: comment[0] });
    })
    .catch(next);
};
