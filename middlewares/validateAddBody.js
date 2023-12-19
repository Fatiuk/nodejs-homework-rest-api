const { httpError } = require("../helpers");

const validateAddBody = (schema) => {
  return (req, res, next) => {
    const requiredFields = {
      name: "Name",
      email: "Email",
      phone: "Phone",
    };

    const missingFields = [];

    Object.keys(requiredFields).forEach((field) => {
      if (!req.body[field]) {
        missingFields.push(requiredFields[field]);
      }
    });

    if (missingFields.length) {
      return next(
        httpError(400, `Missing required field(s): ${missingFields.join(", ")}`)
      );
    }
  };
};

module.exports = validateAddBody;
