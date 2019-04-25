const connection = require("../db/connection");

exports.updateCommentById = (comment_id, body) => {
  if (/[^0-9]/.test(comment_id)) {
    return Promise.reject({ status: 400, msg: "Bad comment_id" });
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
    .select("*")
    .from("comments")
    .where("comment_id", "=", comment_id)
    .increment("votes", body.inc_votes)
    .returning("*");
};

exports.removeCommentById = comment_id => {
  if (/[^0-9]/.test(comment_id)) {
    return Promise.reject({ status: 400, msg: "Bad comment_id" });
  }
  return connection
    .select("*")
    .from("comments")
    .where("comment_id", "=", comment_id)
    .del()
    .returning("*");
};
