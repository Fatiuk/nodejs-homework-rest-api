const { isValidObjectId } = require("mongoose");
const { httpError } = require("../helpers");

const validateObjectId = (req, res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    next(httpError(400, `The provided ID:${contactId} is not in a valid`));
  }

  next();
};

module.exports = validateObjectId;
