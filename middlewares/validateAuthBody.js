const { httpError } = require("../helpers");

const validateAuthBody = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(httpError(400, error.message));
    }
    next();
  };

  return func;
};

module.exports = validateAuthBody;
