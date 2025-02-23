import { useEffect, useState, useRef } from "react";
import useAuth from "../../../hooks/useAuth";
import useConfig from "../../../hooks/useConfig";
import useToast from "../../../hooks/useToast";
import "./Chat.css";
import Button from "../../UI/Button/Button";
import Input from "../../UI/FormControls/Input";
import { FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

const Chat = () => {
  const { auth } = useAuth();
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
  const temp =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAqgMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABgcDBAUBAv/EADgQAAIBAwEFAwkGBwAAAAAAAAABAgMEBREGITFBUWGBkRITIiMyQqGx0RRSU3FywRUkMzRzsvD/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAWEQEBAQAAAAAAAAAAAAAAAAAAARH/2gAMAwEAAhEDEQA/ALSABpkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB3mjlspbYuh5yu25P2Ka9qf/AHUhWR2jyF7JqNXzFLlCk9PF8WDVharhqe95UzqVJPWVSo31cmbtlmchZSToXM9F7s35SfcwaswHEwe0VDJtUasVSutPZT3T/S/2O34gAAAAAAAAAAAAAAAAAAAMF7dU7K0q3NZ+hTWr7eiM5E9urzSFvZxb0l6ya+CAjORva2Qu53Nw/SlwjyiuiNYA0gAAPqEpQnGUG1KL1i1xTLD2cyn8Usdamn2iloqi69Jd5XR2NlLv7LmKUdWoVvVy059PiZVYYHMAAAAAAAAAAAAAAAAACBbaScs1o+VKOnxJ6Qbbem45WnPlOktO5sCOgA0gAABnsZON9byXFVY/NGA28TTdXJ2lNc6sfmZVaAAAAAAAAAAAAAAAAAAAEb23s5VrCndRWsqD9PT7r5+JJD4q04Vac6dSKlCacZJ8GmBU4OtncJVxdZyjFztJP0Ki93sfb8zklAADTAkOxdm6+Slctert48esnwXzORj7C4yNwqNtTcpe9L3YLq2WLisfSxllG3o79H5U5c5S5sg3Hx7wAAAAAAAAAAAAAAAAAAAAHkkpRcZKMotaNSW5nGu9l8ZcPWNOVGT50paLwe437zJ2Vj/dXNOD+7rq/BHHr7X2EH6qlXq9yiviBiexlrruu6yX6YmxbbI46lJSqyrVuyUtF8DUe2tPXdY1NP8AKvoZqW2VnJpVbavT7U1ICQW1vRtaSpW9KFOC5QWhlObZ53G3jUaV1GMn7tT0WdIAAAAAAAAAAAAAAAAAAc7N5alirXzk9J1p7qVPX2n9AM2RyNtjqPnbqoop+zFb5SfYiF5Taa9vHKFBu2odIv0n+bOVe3le+uJV7mbnN+CXRdhgAPe9d+r4vXeACoAAoadTo43NX2N0VCq5Utd9Ko9Yv6HOBBYuFztrlEoL1VxzpTfH8up1ipYSlCSlCTjKL1UluaZONmdoPt+lpeNK5S9CXDzi+pFSIAAAAAAAAAAAABhurila29SvXl5NOEXJsrTKX9bJXdS5uN2u6MeUVyRItt79uVLHwlu3VKunXkv37yJoAACxKAAoAAAAAB9U5zpzU6cnGcWpJriu0+QRYsjZ/KLKWCqTeleD8mrHt5PvOmVzszf/AMPylNylpSq+rnrwWr3PuLGIAAAAAAAAB5u58D01cnVdDHXVVcY0ZNeAFcZS5d5kbm5b/qVG12LgvgkaoQLEoACgAAAAAAAAAAQa1WhZ2GuneYy2ryes5QSl+a3MrEnWxNVzxEofh1Wl3rUipCACAAAAAAHO2hemDvNPwpAAVqACxAAFAAAAAAAAAAACZ7Bv+SuVy86v9T0Eok4AI0AAI//Z";

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
    if (chatBodyRef.current) {
      // Scroll to the end of the element
      chatBodyRef.current.scrollTo(0, chatBodyRef.current.scrollHeight);
      console.log(chatBodyRef.current.scrollHeight);
    }
  }, [chat]); // Empty dependency array means this runs once on mount

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
                  <img
                    src={chat.peer.profileImageURL || temp}
                    alt={`${chat.peer.name}'s profile image`}
                  />
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
                <img
                  src={chat.peer.profileImageURL || temp}
                  alt={`${chat.peer.name}'s profile image`}
                />
              </div>
              <div className="contact-name">
                <h3>{chat.peer.name}</h3>
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
