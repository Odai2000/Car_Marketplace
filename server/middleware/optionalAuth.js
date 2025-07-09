const jwt = require("jsonwebtoken");
const User = require("../models/User");

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader || authHeader?.startsWith("Bearer")) {
    const accessToken = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded;
   
    } catch (error) {
      console.error(error)
    }
    
  }
  next();
};

module.exports = optionalAuth;
