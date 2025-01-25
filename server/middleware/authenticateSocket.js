const jwt = require("jsonwebtoken");

const authenticateSocket = (socket, next) => {
  const accessToken = socket.handshake.auth.token;

  if (!accessToken || !accessToken.startsWith("Bearer")) {
    return next(new Error("no authentication token provided"));
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    socket.userId = decoded.userId;
    next();
  } catch (error) {
    return next(new Error("Invalid token"));
  }
};

module.exports = authenticateSocket;
