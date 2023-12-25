const bcrypt = require("bcrypt");

const User = require("../models/user");

const { httpError, ctrlWrapper } = require("../helpers");

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const user = await User.findOne({ email });

  if (user) {
    throw httpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    message: `User with email ${newUser.email} was successfully created`,
  });
};

module.exports = {
  registerUser: ctrlWrapper(registerUser),
};
