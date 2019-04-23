const { fetchAllTopics } = require("../models/topics");

exports.getTopics = (req, res, next) => {
  console.log("here");
  fetchAllTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
