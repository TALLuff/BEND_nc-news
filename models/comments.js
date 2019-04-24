const connection = require("../db/connection");

exports.updateCommentById = (comment_id, inc_votes) => {
  return connection
    .select("*")
    .from("comments")
    .where("comment_id", "=", comment_id)
    .increment("votes", inc_votes)
    .returning("*");
};

exports.removeCommentById = comment_id => {
  return connection
    .select("*")
    .from("comments")
    .where("comment_id", "=", comment_id)
    .del();
};
