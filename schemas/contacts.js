const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string().min(2).max(16).required().messages({
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 16 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email cannot be empty",
    "string.email": "Invalid email format",
  }),
  phone: Joi.string().min(6).max(16).required().messages({
    "string.empty": "Phone cannot be empty",
    "string.min": "Phone number must be at least 6 digits",
    "string.max": "Phone number cannot exceed 16 digits",
    "number.min": "You must be at least 18 years old",
  }),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = {
  addSchema,
  updateFavoriteSchema,
};
