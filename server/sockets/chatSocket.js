const Chat = require("../models/Chat");

const chatSocket = (io, socket) => {

    socket.on("join_room", async (chatId) => {
        try {
            
        const chat = await Chat.findById(chatId).exec();
    
        if (!chat.particapations.includes(socket.userId))
          return socket.emit("error", "Unauthorized access.");
    
        socket.join(chatId)
        socket.emit('joined_room',chatId)
        } catch (error) {
            return socket.emit('error',error.message)
        }
      });

      socket.on("send_message", ({ chatId, message }) => {
        io.broadcast.to(chatId).emit("receive_message", message);
      });
  
      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.userId}`);
      });
  
};

module.exports = chatSocket;
