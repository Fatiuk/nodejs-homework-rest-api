const express = require("express");
const router = express.Router();

const { validateAuthBody, authenticate } = require("../../middlewares");
const ctrl = require("../../controllers/auth");
const {
  registerSchema,
  loginSchema,
  subscriptionSchema,
} = require("../../schemas");

router.post("/register", validateAuthBody(registerSchema), ctrl.registerUser);

router.post("/login", validateAuthBody(loginSchema), ctrl.loginUser);

router.post("/logout", authenticate, ctrl.logoutUser);

router.post("/current", authenticate, ctrl.getCurrentUser);

router.patch(
  "/:userId",
  authenticate,
  validateAuthBody(subscriptionSchema),
  ctrl.updateSubscription
);

module.exports = router;
