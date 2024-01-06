const path = require("path");
const fs = require("fs/promises");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");

const User = require("../models/user");

const { httpError, ctrlWrapper } = require("../helpers");

const { SECRET_KEY } = process.env;

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw httpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    avatarURL,
    password: hashPassword,
  });

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
