const jwt = require("jsonwebtoken");

const authenticateSocket = (socket, next) => {
  const accessToken = socket.handshake.auth.accessToken;

  if (!accessToken || !accessToken.startsWith("Bearer")) {
    return next(new Error("no authentication token provided"));
  }

  try {
    const decoded = jwt.verify(accessToken.split(' ')[1], process.env.ACCESS_TOKEN_SECRET);

    socket.user_id = decoded._id;
    next();
  } catch (error) {
    console.log(error)
    return next(new Error("Invalid token"));
  }
};

module.exports = authenticateSocket;
