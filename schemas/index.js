const { addSchema, updateFavoriteSchema } = require("./contacts");
const {
  registerSchema,
  emailSchema,
  loginSchema,
  subscriptionSchema,
} = require("./users");

module.exports = {
  addSchema,
  updateFavoriteSchema,
  registerSchema,
  emailSchema,
  loginSchema,
  subscriptionSchema,
};
