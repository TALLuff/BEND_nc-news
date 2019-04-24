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
    .leftJoin("comments", "articles.article_id", "comments.comment_id")
    .groupBy("articles.article_id");
};

exports.fetchArticleById = article_id => {
  return connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", "=", article_id)
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.comment_id")
    .groupBy("articles.article_id");
};

exports.updateArticleById = (article_id, inc_votes = 0) => {
  return connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", "=", article_id)
    .increment("votes", inc_votes)
    .returning("*");
};

exports.fetchArticleCommentsById = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  return connection
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("article_id", "=", article_id)
    .orderBy(sort_by, order);
};

exports.createArticleCommentById = (article_id, author, body) => {
  return connection
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .then(() => {
      return connection("comments")
        .insert({ body, article_id, author })
        .returning("*");
    });
};
