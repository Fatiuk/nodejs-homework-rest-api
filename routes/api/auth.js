const express = require("express");
const router = express.Router();

const { validateAuthBody } = require("../../middlewares");

const ctrl = require("../../controllers/auth");

const { registerSchema, loginSchema } = require("../../schemas");

router.post("/register", ctrl.registerUser);

module.exports = router;
