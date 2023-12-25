const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const { httpError, ctrlWrapper } = require("../helpers");

const { SECRET_KEY } = process.env;

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw httpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    message: `Hey, ${newUser.name}! Your account with email ${newUser.email}, was successfully created`,
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(401, "Email or password is invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw httpError(401, "Email or password is invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "5m" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    message: `Welcome back, ${user.name}! You have successfully logged in`,
    token,
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
  const { name, email, subscription } = req.user;

  res.json({
    name,
    email,
    subscription,
  });
};

module.exports = {
  registerUser: ctrlWrapper(registerUser),
  loginUser: ctrlWrapper(loginUser),
  logoutUser: ctrlWrapper(logoutUser),
  getCurrentUser: ctrlWrapper(getCurrentUser),
};
