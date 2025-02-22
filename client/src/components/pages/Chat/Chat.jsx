import { useEffect, useState, useRef } from "react";
import useAuth from "../../../hooks/useAuth";
import useConfig from "../../../hooks/useConfig";
import useToast from "../../../hooks/useToast";
import "./Chat.css";
import Button from "../../UI/Button/Button";
import { FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

const Chat = () => {
  const { auth } = useAuth();
  const { config } = useConfig();
  const { showToast } = useToast();
  const { peer_id } = useParams();
  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState([]);
  const socket = useRef(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const fetchChats = async () => {
    await fetch(`${config.serverUrl}/chat/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.accessToken}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to load chats");
      })
      .then((data) => {
        setChats(data);
      })
      .catch((error) => {
        console.log(error);
        showToast(error.message, "error");
      });
  };

  const fetchChat = async (peer_id) => {
    await fetch(`${config.serverUrl}/chat/${peer_id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.accessToken}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to fetch chats.");
      })
      .then((data) => {
        setChat(data);
      })
      .catch((error) => {
        console.log(error);
        showToast(error.message, "error");
      });
  };

  useEffect(() => {
    try {
      fetchChats();

      if (peer_id) fetchChat(peer_id);
    } catch (error) {
      console.log(error);
      showToast("Error fetching chats", "error");
    }
  }, [peer_id]);

  useEffect(() => {
    if (chat._id) {
      socket.current = window.io(config.serverUrl, {
        auth: { accessToken: `Bearer ${auth.accessToken}` },
      });
      socket.current.on("connect", () => {
        console.log("Connected to server");
        socket.current.emit("join-room", chat._id);
      });

      socket.current.on("joined-room", (chat_id) => {
        console.log("Room joined", chat_id);
      });

      socket.current.on("receive-message", (message) => {
        console.log(message);
        setChat((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }));
      });
      socket.current.on("connect_error", (error) => {
        console.log(error);
      });
      return () => {
        socket.current.disconnect();
      };
    }
  }, [auth, chat._id]);

  const handleSend = () => {
    socket.current.emit("send-message", {
      chat_id: chat._id,
      message: message,
    });
    setChat((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          sender_id: auth.userData._id,
          content: message,
        },
      ],
    }));
    setMessage("");
  };
  return (
    <>
      <div className="Chat flex">
        <div className="contact-list-view">
          <div className="contact-list-header">
            <Button variant={"icon"} onClick={() => navigate(-1)}>
              <FaArrowLeft />
            </Button>
            <h3>Contacts</h3>
          </div>
          <div className="contacts flex-col">
            {chats?.map((chat) => (
              <div className="contact" key={chat._id}>
                <div className="contact-name">
                  <h3>{chat.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-view">
          <div className="chat-header"></div>
          <div className="chat-messages">
            {chat?.messages?.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${
                  message.senderId === auth.userData._id ? "right" : "left"
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Type a message..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <Button variant="primary" onClick={handleSend}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
