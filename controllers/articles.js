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
    .then(([article]) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  updateArticleById(article_id, req.body)
    .then(([article]) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticleCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  const fetchArticlePromise = fetchArticleById(article_id);
  const fetchCommentsPromise = fetchArticleCommentsById(
    article_id,
    sort_by,
    order
  );
  Promise.all([fetchArticlePromise, fetchCommentsPromise])
    .then(([[article], comments]) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postArticleCommentById = (req, res, next) => {
  const { article_id } = req.params;
  const fetchArticlePromise = fetchArticleById(article_id);
  const createCommentPromise = createArticleCommentById(article_id, req.body);
  Promise.all([fetchArticlePromise, createCommentPromise])
    .then(([[article], [comment]]) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      res.status(201).send({ comment });
    })
    .catch(next);
};
