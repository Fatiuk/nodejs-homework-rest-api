const express = require("express");
const router = express.Router();

const { validateAuthBody, authenticate, upload } = require("../../middlewares");
const ctrl = require("../../controllers/auth");
const {
  registerSchema,
  emailSchema,
  loginSchema,
  subscriptionSchema,
} = require("../../schemas");

router.post("/register", validateAuthBody(registerSchema), ctrl.registerUser);

router.get("/verify/:verificationToken", ctrl.sendVerificationEmail);

router.post(
  "/verify",
  validateAuthBody(emailSchema),
  ctrl.resendVerificationEmail
);

router.post("/login", validateAuthBody(loginSchema), ctrl.loginUser);

router.post("/logout", authenticate, ctrl.logoutUser);

router.post("/current", authenticate, ctrl.getCurrentUser);

router.patch(
  "/:userId",
  authenticate,
  validateAuthBody(subscriptionSchema),
  ctrl.updateSubscription
);

router.patch(
  "/avatar/update",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

module.exports = router;
