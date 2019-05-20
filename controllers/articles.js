const {
  fetchArticles,
  fetchArticleById,
  updateArticleById,
  fetchArticleCommentsById,
  createArticleCommentById,
  fetchUserByUsername,
  fetchTopicBySlug,
  createArticle,
  removeArticleById
} = require("../models/articles");

exports.getArticles = (req, res, next) => {
  const validColumns = [
    "article_id",
    "author",
    "created_at",
    "title",
    "topic",
    "votes",
    "comment_count"
  ];
  let { author, topic, sort_by, order } = req.query;
  if (!validColumns.includes(sort_by)) {
    sort_by = undefined;
  }
  if (!["asc", "desc"].includes(order)) {
    order = undefined;
  }

  const fetchUserPromise = fetchUserByUsername(author);
  const fetchTopicPromise = fetchTopicBySlug(topic);
  const fetchArticlesPromise = fetchArticles(author, topic, sort_by, order);

  Promise.all([fetchUserPromise, fetchTopicPromise, fetchArticlesPromise])
    .then(([[user], [topic], articles]) => {
      if (!user) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
      if (!topic) {
        return Promise.reject({ status: 404, msg: "Topic not found" });
      }
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
  const validColumns = ["author", "body", "comment_id", "created_at", "votes"];
  const { article_id } = req.params;
  let { sort_by, order } = req.query;
  if (!validColumns.includes(sort_by)) {
    sort_by = undefined;
  }
  if (!["asc", "desc"].includes(order)) {
    order = undefined;
  }
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

exports.postArticle = (req, res, next) => {
  const { author, topic, title, body } = req.body;
  createArticle(author, topic, title, body)
    .then(([article]) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  removeArticleById(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(console.log);
};
