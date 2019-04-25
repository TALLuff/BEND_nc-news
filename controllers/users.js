const { fetchUser } = require("../models/users");

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUser(username)
    .then(user => {
      if (!user.length) {
        return Promise.reject({ status: 404, msg: "Username is not valid" });
      }
      res.status(200).send({ user: user[0] });
    })
    .catch(next);
};
