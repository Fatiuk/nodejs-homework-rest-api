const path = require("path");
const fs = require("fs/promises");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");
const handlebars = require("handlebars");

const User = require("../models/user");

const { httpError, ctrlWrapper, sendEmail } = require("../helpers");

const { SECRET_KEY, DB_SERVER_PORT = 8080, BASE_URL } = process.env;

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw httpError(409, "Email already in use");
  }

  const avatarURL = gravatar.url(email);

  const verificationToken = uuidv4();

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    avatarURL,
    verificationToken,
    password: hashPassword,
  });

  const templatePath = "./templates/emailTemplate.hbs";
  const templateContent = await fs.readFile(templatePath, "utf-8");

  const emailTemplate = handlebars.compile(templateContent);

  const emailData = {
    url: `${BASE_URL}:${DB_SERVER_PORT}/api/auth/verify/${verificationToken}`,
  };

  const htmlContent = emailTemplate(emailData);

  const verifyEmail = {
    to: email,
    subject: "Verify your email",
    html: htmlContent,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
    message: `Hey, ${newUser.name}! Your account with email ${newUser.email}, was successfully created`,
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw httpError(401, "Email or password is invalid");
  }

  const { _id: id, password: hashedPassword } = user;
  const passwordCompare = await bcrypt.compare(password, hashedPassword);

  if (!passwordCompare) {
    throw httpError(401, "Invalid email or password");
  }

  const payload = { id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "5m" });
  await User.findByIdAndUpdate(id, { token });
  const { name, subscription, avatarURL } = user;

  res.status(200).json({
    token,
    user: {
      email,
      subscription,
      avatarURL,
    },
    message: `Welcome back, ${name}! You have successfully logged in`,
  });
};

const logoutUser = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });

  res.status(204).json({
    message: "Your have signed out. Thank you for visiting!",
  });
};

const getCurrentUser = (req, res) => {
  const { name, email, subscription, avatarURL } = req.user;

  res.json({
    name,
    email,
    subscription,
    avatarURL,
  });
};

const updateSubscription = async (req, res) => {
  const { userId } = req.params;
  const { subscription } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { subscription },
    { new: true }
  );

  res.json({
    message: `Subscription updated to ${user.subscription} successfully`,
    subscription: user.subscription,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, filename } = req.file;

  const avatarName = filename;

  const image = await Jimp.read(tempUpload);
  await image
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(tempUpload);

  const resultUpload = path.join(avatarDir, avatarName);
  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", avatarName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    message: `Your avatar has been updated successfully`,
    avatarURL,
  });
};

module.exports = {
  registerUser: ctrlWrapper(registerUser),
  loginUser: ctrlWrapper(loginUser),
  logoutUser: ctrlWrapper(logoutUser),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
