const connection = require("../db/connection");

exports.fetchArticles = (
  author,
  topic,
  sort_by = "created_at",
  order = "desc"
) => {
  return connection
    .select("*")
    .from("articles")
    .modify(query => {
      if (author) {
        query.where("author", "=", author);
      }
      if (topic) {
        query.where("topic", "=", topic);
      }
    })
    .orderBy(sort_by, order);
};
