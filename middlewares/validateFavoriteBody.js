const { httpError } = require("../helpers");

const validateFavoriteBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      if (req.method === "PATCH" && !req.body.favorite) {
        next(httpError(400, "Missing field favorite"));
      } else {
        next(error);
      }
    } else {
      next();
    }
  };
};

module.exports = validateFavoriteBody;
