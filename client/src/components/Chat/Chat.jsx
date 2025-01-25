import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";

import "./Chat.css";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const Chat = () => {
  const [userData, setUserData] = useState(null);

  const { auth } = useAuth();

  useEffect(() => {
    fetch(`${serverUrl}/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.accessToken}`,
      },
    }).then((response) => {
      response
        .json()
        .then((data) => {
          setUserData(data);
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
        });
    });

    //set socket
    const socket = io(serverUrl, {
      auth: { token: auth.accessToken },
    });

    socket.emit('join_room','')
    
  }, [auth]);

  const messages = [];
  return (
    <>
      <div className="Chat">
        <div className="flex">
          <div className="left">
            <div className="contacts flex-col"></div>
          </div>
          <div className="right">
            <div className="chat-header"></div>
            <div className="chat">
              {messages.forEach((message) => {
                <div
                  className={`chat-message ${
                    message._id === userData._id ? "right" : "left"
                  }`}
                >
                  {message.message}
                </div>;
              })}
            </div>
            <div className="chat-footer"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
