const express = require("express");
const router = express.Router();

const { validateAuthBody } = require("../../middlewares");
const ctrl = require("../../controllers/auth");
const { registerSchema, loginSchema } = require("../../schemas");

router.post("/register", validateAuthBody(registerSchema), ctrl.registerUser);

router.post("/login", validateAuthBody(loginSchema), ctrl.loginUser);

module.exports = router;
