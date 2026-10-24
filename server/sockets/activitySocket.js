const User = require("../models/User");

const onlineUsers = new Map();

const activitySocket = (io, socket) => {
  const user_id = socket.user_id;

  //  watch single user activity
  socket.on("watch-user", async (user_id) => {
    try {
      socket.join(`presence:${user_id}`);
    } catch (error) {
      return socket.emit("error", error.message);
    }
  });
  socket.on("unwatch-user", async (user_id) => {
    try {
      socket.leave(`presence:${user_id}`);
    } catch (error) {
      return socket.emit("error", error.message);
    }
  });
  // watch multiple users activity

  socket.on("watch-users", async (user_ids=[]) => {
    try {

      user_ids.forEach((_id) => {
        socket.join(`presence:${_id}`);
      });
    } catch (error) {
      return socket.emit("error", error.message);
    }
  });

  socket.on("unwatch-users", async (user_ids) => {
    try {
      user_ids.forEach((_id) => {
        socket.leave(`presence:${_id}`);
      });
    } catch (error) {
      return socket.emit("error", error.message);
    }
  });

  socket.on("register-user", async () => {
    const now = new Date();

    const sockets = onlineUsers.get(user_id) || new Set();
    sockets.add(socket.id);
    onlineUsers.set(user_id, sockets);
console.log(`sockets: ${onlineUsers.get(user_id) }`)
    await User.findByIdAndUpdate(user_id, {
      status: "online",
      lastSeen: now,
    });

    io.to(`presence:${user_id}`).emit("presence:update", {
      user_id,
      online: true,
      lastSeen: now,
    });
  });
  socket.on("disconnect", async () => {
    const sockets = onlineUsers.get(user_id);
    if (!sockets) return;

    sockets.delete(socket.id);

    if (sockets.size === 0) {
      onlineUsers.delete(user_id);

      const now = new Date();

      await User.findByIdAndUpdate(user_id, {
        status: "offline",
        lastSeen: now,
      });

      io.to(`presence:${user_id}`).emit("presence:update", {
        user_id,
        online: false,
        lastSeen: now,
      });
    }
  });
};
module.exports = activitySocket;
