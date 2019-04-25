const connection = require("../db/connection");

exports.fetchArticles = (
  author,
  topic,
  sort_by = "created_at",
  order = "desc"
) => {
  return connection
    .select(
      "articles.article_id",
      "articles.author",
      "articles.created_at",
      "articles.title",
      "articles.topic",
      "articles.votes"
    )
    .from("articles")
    .modify(query => {
      if (author) {
        query.where("articles.author", "=", author);
      }
      if (topic) {
        query.where("topic", "=", topic);
      }
    })
    .orderBy(sort_by, order)
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id");
};

exports.fetchArticleById = article_id => {
  if (/[^0-9]/.test(article_id)) {
    return Promise.reject({ status: 400, msg: "Bad article_id" });
  }
  return connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", "=", article_id)
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id");
};

exports.updateArticleById = (article_id, body) => {
  if (/[^0-9]/.test(article_id)) {
    return Promise.reject({ status: 400, msg: "Bad article_id" });
  } else if (!Object.keys(body).length) {
    return Promise.reject({
      status: 400,
      msg: "Bad request body, nothing sent"
    });
  } else if (
    Object.keys(body)[0] !== "inc_votes" ||
    Object.keys(body).length !== 1
  ) {
    return Promise.reject({
      status: 400,
      msg: "Bad request body, invalid properties given"
    });
  } else if (/[^0-9]/.test(body.inc_votes)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request body, inc_votes not integer value"
    });
  }
  return connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", "=", article_id)
    .increment("votes", body.inc_votes)
    .returning("*");
};

exports.fetchArticleCommentsById = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  if (/[^0-9]/.test(article_id)) {
    return Promise.reject({ status: 400, msg: "Bad article_id" });
  }
  return connection
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("article_id", "=", article_id)
    .orderBy(sort_by, order);
};

exports.createArticleCommentById = (article_id, body) => {
  if (/[^0-9]/.test(article_id)) {
    return Promise.reject({ status: 400, msg: "Bad article_id" });
  } else if (!Object.keys(body).length) {
    return Promise.reject({
      status: 400,
      msg: "Bad request body, nothing sent"
    });
  } else if (
    !Object.keys(body).includes("username") ||
    !Object.keys(body).includes("body") ||
    Object.keys(body).length !== 2
  ) {
    return Promise.reject({
      status: 400,
      msg: "Bad request body, invalid properties given"
    });
  } else if (
    typeof body.username !== "string" ||
    typeof body.body !== "string"
  ) {
    return Promise.reject({
      status: 400,
      msg: "Bad request body, username and body must be strings"
    });
  }
  return connection("comments")
    .insert({ body: body.body, article_id, author: body.username })
    .returning("*");
};
