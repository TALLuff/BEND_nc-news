const { updateCommentById, removeCommentById } = require("../models/comments");

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  updateCommentById(comment_id, req.body)
    .then(([comment]) => {
      if (!comment) {
        return Promise.reject({ status: 404, msg: "Comment does not exist" });
      }
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(([comment]) => {
      if (!comment) {
        return Promise.reject({ status: 404, msg: "Comment does not exist" });
      }
      res.status(204).send();
    })
    .catch(next);
};
