const Chat = require("../models/Chat");

const chatSocket = (io, socket) => {

    socket.on("join-room", async (chat_id) => {
        try {
        const chat = await Chat.findById(chat_id).lean();

        if (!chat.participants.map(id=>id.toString()).includes(socket88.user_id)){
          return socket.emit("error", "Unauthorized access to room.");
        }
        socket.join(chat_id)
        console.log(`User ${socket.user_id} joined room ${chat_id}`);
        socket.emit('joined-room',chat_id)
        } catch (error) {
            return socket.emit('error',error.message)
        }
      });

      socket.on("send-message", async({ chat_id, message }) => {
        try{
          const chat = await Chat.findById(chat_id).exec();

          if(!chat) return socket.emit('error', "Chat not found.");

          if(!chat.participants.map(id=>id.toString()).includes(socket.user_id)) return socket.emit('error', "Unauthorized access..");

          const newMessage = {
            sender_id: socket.user_id,
            content: message
          };
          
          chat.messages.push(newMessage); 
          await chat.save();

          socket.to(chat_id).emit("receive-message", newMessage);
        } catch (error) {
          console.log(error)
          return socket.emit('error',error.message)
        }
      });
  
      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.user_id}`);
      });
  
};

module.exports = chatSocket;
