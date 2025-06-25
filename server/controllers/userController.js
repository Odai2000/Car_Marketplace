const User = require("../models/User");
const Token = require("../models/Token");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const EmailManager = require("../modules/email/emailManager");
const emailManager = new EmailManager("brevo");

//get users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();

  if (!users.length) return res.status(400).json({ message: "No users found" });

  res.status(200).json(users);
});

// *check how to combine these two
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body._id)
    .select("-password -savedPosts")
    .lean();

  if (!user) return res.status(400).json({ message: "No user found" });

  res.status(200).json(user);
});

const getUserPersonalData = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password").lean();

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

  if (password.length < 8)
    return res.status(400).json({ message: "Password is too short!" });

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

  try {
    await sendVerificationLink(user);
  } catch (error) {
    console.error("Error sending verification:", error);
  }

  res.status(201).json({
    message: "User created. Please check your email for verification link.",
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { _id, username, email, firstName, lastName, roles } = req.body;

  if (req.user._id !== _id && !req.user.roles.includes("ADMIN")) {
    console.log(`${req.user._id} === ${_id} `);
    return res.status(403).send("Forbidden");
  }

  const user = await User.findById(_id);

  if (!user) {
    return res.status(400).send(`No user with id: ${_id} was found`);
  }

  //Check for username duplicate
  if (username) {
    const duplicate = await User.findOne({ username }).lean();
    if (duplicate && duplicate?._id.toString() !== _id.toString()) {
      return res.status(400).send("Username already exists");
    }
  }

  Object.assign(user, {
    ...(username && { username }),
    ...(firstName && { firstName }),
    ...(lastName && { lastName }),
    ...(email && { email }),
    ...(roles && { roles }),
  });

  // If email is being updated, set emailVert to false
  if (email && email !== user.email) {
    user.emailVert = false;

    try {
      await sendVerificationLink(user);
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  }

  const updatedUser = await user.save();

  if (!updatedUser) {
    return res.status(400).send("Update failed");
  }

  const userData = {
    _id: updatedUser._id,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    username: updatedUser.username,
    email: updatedUser.email,
    emailVert: updatedUser.emailVert,
    profileImageId: updatedUser.profileImageId,
    roles: updatedUser.roles,
  };
  res.status(200).json({ message: "User updated", userData: userData });
});

const changePassword = asyncHandler(async (req, res) => {
  const _id = req.user._id;
  const { password, newPassword } = req.body;
  if (!password || !newPassword) {
    return res.status(400).send("All fields are required");
  }

  const user = await User.findById(_id);

  if (!user) {
    return res
      .status(400)
      .json({ message: `No user with id: ${_id} was found` });
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).send("Authentication failed");
  }

  if (newPassword < 8) {
    res.status(400).send("password must be at least 8 characters long");
  }

  user.password = await bcrypt.hash(newPassword, 10);

  const updatedUser = await user.save();
  if (!updatedUser) {
    return res.status(400).json({ message: "Password change failed" });
  }

  res.status(200).json({ message: "Password changed." });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  if (req.user._id !== _id && !req.user.roles.includes("ADMIN")) {
    console.log(`${req.user._id} === ${_id} `);
    return res.status(403).send("Forbidden");
  }

  const queryResult = await User.findByIdAndDelete(_id).lean();

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
      res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL);
      res.setHeader(
        "Access-Control-Allow-METHODS",
        "GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS, PATCH"
      );

      const token = await Token.create({
        userID: user._id,
        token: refreshToken,
      });

      if (!token) return res.status(500).send("server Error");
      const userData = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        emailVert: user.emailVert,
        profileImageId: user.profileImageId,
        roles: user.roles,
        savedPosts: user.savedPosts,
      };
      return res
        .status(200)
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        })
        .json({ accessToken: accessToken, userData: userData });
    } else {
      return res.status(401).send("Authentication Failed.");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

const logout = asyncHandler(async (req, res) => {
  try {
    //sends null token
    return res
      .status(200)
      .cookie("refreshToken", "", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: -0,
      })
      .send("user logged out.");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
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
    const { token } = req.body;
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

const savePost = asyncHandler(async (req, res) => {
  const user_id = req.user._id;
  const post_id = req.body.post_id;

  try {
    await User.updateOne(
      { _id: user_id },
      { $addToSet: { savedPosts: post_id } }
    );

    const updatedUser = await User.findById(user_id)
      .select("savedPosts")
      .lean();

    res.status(200).json({ savedPosts: updatedUser.savedPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

const unsavePost = asyncHandler(async (req, res) => {
  const user_id = req.user._id;
  const post_id = req.body.post_id;

  try {
    await User.updateOne({ _id: user_id }, { $pull: { savedPosts: post_id } });

    const updatedUser = await User.findById(user_id)
      .select("savedPosts")
      .lean();

      res.status(200).json({ savedPosts: updatedUser.savedPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

const getSavedPosts = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("savedPosts")
      .select("savedPosts")
      .lean();

    res.status(200).json({ savedPosts: user?.savedPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// auxiliary functions

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      roles: user.roles,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "600s",
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      roles: user.roles,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "15d",
    }
  );
};

const sendVerificationLink = async (user) => {
  try {
    const token = jwt.sign(
      { email: user.email },
      process.env.EMAIL_VERIFICATION_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    const verificationLink = `${process.env.CLIENT_URL}/user/${user._id}/verify-email?token=${token}`;

    console.log("Attempting to send verification email to:", user.email);
    console.log("Using verification link:", verificationLink);

    await emailManager.sendEmail({
      from: process.env.VERIFY_EMAIL_ADDRESS,
      to: user.email,
      subject: "Verify your email",
      html: `
      <h2>Email verification</h2>
      <span>Follow this Link to verify your email: <a href="${verificationLink}">${verificationLink}</a></span>`,
    });

    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw error;
  }
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

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, data) => {
      if (err) return res.status(403).send(`Invalid token: ${err}`);

      const user = await User.findById(data._id).lean();
      if (!user) res.status(403).send(`Invalid token: ${err}`);

      const accessToken = generateAccessToken(user);

      const userData = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        emailVert: user.emailVert,
        profileImageId: user.profileImageId,
        roles: user.roles,
        savedPosts: user.savedPosts,
      };

      res.status(200).json({ accessToken: accessToken, userData: userData });
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
  logout,
  refreshTheToken,
  changePassword,
  resendEmailVerification,
  verifyEmail,
  savePost,
  unsavePost,
  getSavedPosts,
};
