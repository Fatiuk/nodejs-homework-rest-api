const { httpError } = require("../helpers");

const validateAddBody = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      next(httpError(400, error.details[0].message));
    }
    next();
  };
  return func;
};

module.exports = validateAddBody;
