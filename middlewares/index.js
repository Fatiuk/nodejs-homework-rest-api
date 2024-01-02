const validateAddBody = require("./validateAddBody");
const validateObjectId = require("./validateObjectId");
const validateFavoriteBody = require("./validateFavoriteBody");
const validateAuthBody = require("./validateAuthBody");
const authenticate = require("./authenticate");

module.exports = {
  validateAddBody,
  validateObjectId,
  validateFavoriteBody,
  validateAuthBody,
  authenticate,
};
