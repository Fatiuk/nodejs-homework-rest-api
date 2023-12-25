const express = require("express");
const router = express.Router();

const { validateAuthBody, authenticate } = require("../../middlewares");
const ctrl = require("../../controllers/auth");
const { registerSchema, loginSchema } = require("../../schemas");

router.post("/register", validateAuthBody(registerSchema), ctrl.registerUser);

router.post("/login", validateAuthBody(loginSchema), ctrl.loginUser);

router.post("/logout", authenticate, ctrl.logoutUser);

router.post("/current", authenticate, ctrl.getCurrentUser);

module.exports = router;
