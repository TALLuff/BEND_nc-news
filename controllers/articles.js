const { fetchArticles } = require("../models/articles");

exports.getArticles = (req, res, next) => {
  const { author, topic, sort_by, order } = req.query;
  fetchArticles(author, topic, sort_by, order)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
