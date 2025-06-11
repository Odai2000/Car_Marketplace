import { useEffect, useState, useRef } from "react";
import useAuth from "../../../hooks/useAuth";
import useConfig from "../../../hooks/useConfig";
import useToast from "../../../hooks/useToast";
import "./Chat.css";
import Button from "../../UI/Button/Button";
import Input from "../../UI/FormControls/Input";
import { FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import DefaultProfile from "../../UI/Utility/DefaultProfile/DefaultProfile";
import useAuthFetch from "../../../hooks/useAuthFetch";

const Chat = () => {
  const { auth } = useAuth();
  const authFetch  = useAuthFetch();
  const { config } = useConfig();
  const { showToast } = useToast();
  const { peer_id } = useParams();
  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState("");
  const socket = useRef(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const chatBodyRef = useRef(null);
  const [toggleView, setToggleView] = useState(false);

  const fetchChats = async () => {
    await authFetch(`${config.serverURL}/chat`, {
      headers: {
        "Content-Type": "application/json",
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
    await authFetch(`${config.serverURL}/chat/${peer_id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to fetch chat with the specified user.");
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
    if (chatBodyRef.current) {
      // Scroll to the end of the element
      chatBodyRef.current.scrollTo(0, chatBodyRef.current.scrollHeight);
      console.log(chatBodyRef.current.scrollHeight);
    }
  }, [chat]); // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (chat._id) {
      socket.current = window.io(config.serverURL, {
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
          createdAt: Date.now(),
        },
      ],
    }));
    setMessage("");
  };

  const handleContactClick = (peer_id) => {
    fetchChat(peer_id);
    setToggleView(true);
  };
  
  return (
    <>
      <div className="Chat flex">
        <div className={`contact-list-view ${!toggleView && "toggled"}`}>
          <div className="contact-list-header flex">
            <Button variant={"icon"} onClick={() => navigate(-1)}>
              <FaArrowLeft />
            </Button>
            <h2>Chats</h2>
          </div>
          <div className="contacts flex-col">
            {chats?.map((chat) => (
              <div
                className="contact"
                key={chat._id}
                onClick={() => handleContactClick(chat.peer.peer_id)}
              >
                <div className="profile-image">
                  {chat?.peer?.profileImageURL ?
                  <img
                    src={chat.peer.profileImageURL}
                    alt={`${chat.peer.name}'s profile image`}
                  />:
                  <DefaultProfile size="32px" />}
                </div>
                <div className="contact-name">
                  <h3>{chat.peer.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`chat-view  ${toggleView && "toggled"}`}>
          {chat && (
            <div className="chat-header contact">
              <Button variant={"icon"} onClick={() => setToggleView(false)}>
                <FaArrowLeft />
              </Button>
              <div className="profile-image">
              {chat?.peer?.profileImageURL ?
                  <img
                    src={chat.peer.profileImageURL}
                    alt={`${chat.peer.name}'s profile image`}
                  />:
                  <DefaultProfile size="32px" />}
              </div>
              
              <div className="contact-name">
                <h3>{chat.peer?.name}</h3>
              </div>
            </div>
          )}

          <div className="chat-body" ref={chatBodyRef}>
            {chat?.messages?.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${
                  message.sender_id === auth.userData._id ? "right" : ""
                }`}
              >
                <div className="text">{message.content}</div>
                <div className="time">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="chat-footer">
            <Input
              type="text"
              styleName="message-box flex"
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
