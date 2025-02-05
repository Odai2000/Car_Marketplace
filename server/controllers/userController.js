const User = require("../models/User");
const Token = require("../models/Token");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const EmailManager = require("../modules/email/emailManager");
const emailManager = new EmailManager("bervo");

//get users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();

  if (!users.length) return res.status(400).json({ message: "No users found" });

  res.status(200).json(users);
});

// *check how to combine these two
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.userId).select("-password").lean();

  if (!user) return res.status(400).json({ message: "No user found" });

  res.status(200).json(user);
});

const getUserPersonalData = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password").lean();

  if (!user) return res.status(400).json({ message: "No user found" });

  res.status(200).json(user);
});

const createUser = asyncHandler(async (req, res) => {
  const { username, password, firstName, lastName, email } = req.body;

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
  };

  const user = await User.create(obj);

  if (!user) return res.status(400).json({ message: "Error: Invalid data." });

  sendVerificationLink(user);

  res.status(201).json({ message: "User created." });
});

const updateUser = asyncHandler(async (req, res) => {
  const { id, username, email, firstName, lastName, roles } = req.body;

  if (!req.user._id === id || !req.user.roles.includes("ADMIN"))
    return res.status(403).send("Forbidden");

  if (
    !id ||
    !username ||
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

  const updatedUser = await user.save();

  if (!updatedUser) {
    return res.status(400).json({ message: "Update failed" });
  }

  res.status(200).json({ message: "User updated." });
});

const changePassword = asyncHandler(async (req, res) => {
  const _id = req.user._id;

  if (
    !password ||
    (!Array.isArray(roles) && res.status(400).json({ message: roles }))
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findById(_id);

  if (!user) {
    return res
      .status(400)
      .json({ message: `No user with id: ${id} was found` });
  }

  if (!password >= 8) {
    res.send
      .status(400)
      .json({ message: "password must be at least 8 characters long" });
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  if (!updatedUser) {
    return res.status(400).json({ message: "Password update failed" });
  }

  sendVerificationLink(user);

  res.status(200).json({ message: "Password changed." });
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

    const user = await User.findOne({ username }).lean();

    if (!user) return res.status(404).send("Username not found.");

    if (await bcrypt.compare(password, user.password)) {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      res.setHeader("Access-Control-Allow-Credentials", true);
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, authorization"
      );
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:8097");
      res.setHeader(
        "Access-Control-Allow-METHODS",
        "GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS, PATCH"
      );
      console.log(user);
      const token = await Token.create({
        userID: user._id,
        token: refreshToken,
      });
      if (!token) return res.status(500).send("server Error");
      return res
        .status(200)
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        })
        .json({ accessToken: accessToken, roles: user.roles });
    } else {
      return res.status(401).send("Authentication Failed.");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

const resendEmailVerification = asyncHandler(async (req, res) => {
  const user = req.user;
  await sendVerificationLink(user)
    .then(() => {
      res.status(200).send("Verification Sent");
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

const verifyEmail = asyncHandler(async (req, res) => {
  try {
    const token = req.params.token;
    jwt.verify(token, process.env.EMAIL_VERIFICATION_TOKEN_SECRET);

    const user = await User.findById(req.params._id);
    if (!user) return res.status(404).send("User not found.");

    user.emailVert = true;
    await user.save();

    res.status(200).send("Email verified.");
  } catch (error) {
    return res.status(400).send("Invalid Token");
  }
});

// auxiliary functions

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "120s",
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      roles: user.roles,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "15d",
    }
  );
};

const sendVerificationLink = async (user) => {
  const token = jwt.sign(
    { email: user.email },
    process.env.EMAIL_VERIFICATION_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
  const verificationLink = `${process.env.CLIENT_URL}/user/${user._id}/verify/${token}`;
  await emailManager.sendEmail({
    from: process.env.VERIFY_EMAIL_ADDRESS,
    to: user.email,
    subject: "Verify your email",
    html: `
    <h2>Email verification</h2>
    <span>Follow this Link to verify your email: <a>${verificationLink}</a></span>`,
  });
};

//generate access token; refresh is a verb
const refreshTheToken = asyncHandler(async (req, res) => {
  try {
    //get cookie from request
    const token = await req.cookies.refreshToken;

    console.log("token: ", token);

    //check if cookie exist in DB
    if (!token) return res.status(401).send();
    const refreshToken = await Token.findOne({ token });

    //double verify the token
    if (!refreshToken)
      return res.status(403).send(`Invalid token: ${refreshToken}`);

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
      if (err) return res.status(403).send(`Invalid token: ${err}`);
      const accessToken = generateAccessToken({ _id: data.userId });

      res.status(200).json({ accessToken: accessToken, roles: data.roles });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

module.exports = {
  getAllUsers,
  getUser,
  getUserPersonalData,
  createUser,
  updateUser,
  deleteUser,

  loginUser,
  refreshTheToken,
  changePassword,
  resendEmailVerification,
  verifyEmail,
};
