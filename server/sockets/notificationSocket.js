const notificationSocket = (io, socket) => {
  socket.on("register-user", async (user_id) => {
    socket.join(user_id);
    // console.log("[SOCKET] Joined room:", user_id);
    // console.log("[SOCKET] Rooms:", socket.rooms);
  });
};

module.exports = notificationSocket;
