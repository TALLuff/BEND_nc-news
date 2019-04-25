exports.routeNotFound = (req, res) => {
  res.status(404).send({ msg: "Route Not Found" });
};

exports.methodNotAllowed = (req, res) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  const psqlBadRequestCodes = ["22P02"];
  const psqlNotFoundCodes = ["23503"];
  if (psqlBadRequestCodes.includes(err.code)) {
    res.status(400).send({ msg: err.msg || "Bad Request" });
  } else if (psqlNotFoundCodes.includes(err.code)) {
    res.status(404).send({ msg: err.msg || "Not found" });
  }
  next(err);
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
