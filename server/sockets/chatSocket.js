const Chat = require("../models/Chat");

const chatSocket = (io, socket) => {

    socket.on("join_room", async (chatId) => {
        try {
            
        const chat = await Chat.findById(chatId).exec();
    
        if (!chat.participations.includes(socket.userId))
          return socket.emit("error", "Unauthorized access.");
    
        socket.join(chatId)
        socket.emit('joined_room',chatId)
        } catch (error) {
            return socket.emit('error',error.message)
        }
      });

      socket.on("send_message", async({ chatId, message }) => {
        try{
          const chat = await Chat.findById(chatId).exec();

          if(!chat) return socket.emit('error', "Chat not found.");

          if(!chat.participations.includes(socket.userId)) return socket.emit('error', "Unauthorized access.");

          const newMessage = {
            sender: socket.userId,
            content: message
          };
          
          chat.messages.push(newMessage);
          await chat.save();

          io.to(chatId).emit("receive_message", message);
        } catch (error) {
          console.log(error)
          return socket.emit('error',error.message)
        }
      });
  
      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.userId}`);
      });
  
};

module.exports = chatSocket;
