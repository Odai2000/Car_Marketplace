const User = require("../models/User");
const Token = require("../models/Token");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");


//get users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();

  if (!users.length) return res.status(400).json({ message: "No users found" });

  res.status(200).json(users);
});

const createUser = asyncHandler(async (req, res) => {
  const { username, password, firstName, lastName, email, roles } = req.body;

  //confirm fields
  if (
    (!username && res.status(400).json({ message: username })) ||
    !password ||
    !firstName ||
    !lastName ||
    !email
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //check for duplicate
  const duplicate = await User.findOne({ username }).lean();

  if (duplicate)
    return res.status(400).json({ message: "Username already exists" });

  if (!password.length >= 8)
    return res.status("400").json({ message: "Password is too short!" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const obj = {
    username,
    password: hashedPassword,
    firstName,
    lastName,
    email,
    roles,
  };

  const user = await User.create(obj);

  if (!user) return res.status(400).json({ message: "Error: Invalid data." });

  res.status(201).json({ message: "User created." });
});

const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, email, firstName, lastName, roles } =
    req.body;

  if (
    !id ||
    !username ||
    !password ||
    !email ||
    !firstName ||
    !lastName ||
    (!Array.isArray(roles) && res.status(400).json({ message: roles }))
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findById(id);

  if (!user) {
    return res
      .status(400)
      .json({ message: `No user with id: ${id} was found` });
  }

  //Check for username duplicate
  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate && duplicate?._id.toString() !== id.toString()) {
    return res.status(400).json({ message: "Username already exists" });
  }

  user.username = username;
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.roles = roles;

  if (!password >= 8) {
    res.send
      .status(400)
      .json({ message: "password must be at least 8 characters long" });
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  if (!updatedUser) {
    return res.status(400).json({ message: "Update failed" });
  }

  res.status(200).json({ message: "User updated." });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const user = await User.findById(id).lean().exec();

  if (!user) {
    return res
      .status(404)
      .json({ message: `No user with id: ${id} was found.` });
  }
  const queryResult = await User.deleteOne({ _id: id }).exec();

  res.json({
    message: `User ${queryResult.username} with id: ${queryResult._id} deleted.`,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findOne({ username }).select("-_id").lean();

    const generateAccessToken = (user) => {
      return jwt.sign(
        {
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "10s",
        }
      );
    };

    const generateRefreshToken = (user) => {
      return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    };

    if (!user) return res.status(404).send("Username not found.");

    if (await bcrypt.compare(password, user.password)) {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      return res
        .status(200)
        .json({ accessToken: accessToken, refreshToken: refreshToken });
    } else {
      return res.status(401).send("Authentication Failed.");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

const refreshToken = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken;
  if (token == null) return res.status(401);
  const refreshToken = Token.findOne({ token });
  if (!refreshToken) return res.status(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid Token.");
    const accessToken = generateAccessToken(user);
    res.json({ accessToken: accessToken });
  });
});

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  refreshToken,
};
