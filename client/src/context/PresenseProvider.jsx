import useAuth from "@/hooks/useAuth";
import useConfig from "@/hooks/useConfig";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const PresenceContext = createContext(null);

export function PresenceProvider({ children }) {
  const { auth } = useAuth();

  const { config } = useConfig();
const socketRef = useRef(null);
  const [presence, setPresence] = useState({});
  const watchCountsRef = useRef(new Map());

  useEffect(() => {
    if (!auth) return;

    if (!socketRef.current) {
      socketRef.current = window.io(config?.serverURL, {
        auth: {
          accessToken: `Bearer ${auth.accessToken}`,
        },
      });
      const socket = socketRef.current
        socket.on("connect", () => {
        console.log("[SOCKET CONNECTED]", socket.id);
        // socket.emit("register-user", socket.auth.user_id);
      });

      socket.on(
        "presence:update",
        ( data ) => {
                 const {user_id, online, lastSeen} = data||null
                  console.log("[SOCKET works]", user_id);
          setPresence((prev) => ({
            ...prev,
            [user_id]: { online, lastSeen },
          }));
        },
      );

      socket.on("connect_error", (err) => {
        console.error("[CLIENT] connect_error:", err.message);
      });
    }
  }, [auth]);

  const watchUser = (user_id) => {
    const count = watchCountsRef.current.get(user_id) || 0;
    watchCountsRef.current.set(user_id, count + 1);
    const socket = socketRef.current;
    if (!socket || !user_id) return;
  
    watchCountsRef.current.set(user_id, count + 1);
    socket.emit("watch-user", user_id);
  };

  const unwatchUser = (user_id) => {
    const socket = socketRef.current;
    if (!socket || !user_id) return;

    const count = watchCountsRef.current.get(user_id) || 0;
    watchCountsRef.current.set(user_id, count - 1);
    socket.emit("unwatch-user", user_id);
  };

  const watchUsers = (user_ids = []) => {
    const socket = socketRef.current;
    if (!socket || !user_ids.length) return;

    user_ids.forEach((_id) => {
      const count = watchCountsRef.current.get(_id) || 0;
      watchCountsRef.current.set(_id, count + 1);

      if (count === 0) {
        socket.emit("watch-users", _id);
      }
    });
  };

  const unwatchUsers = (user_ids = []) => {
    const socket = socketRef.current;
    if (!socket || !user_ids.length) return;

    user_ids.forEach((_id) => {
      const count = watchCountsRef.current.get(_id) || 0;

      if (count <= 1) {
        watchCountsRef.current.delete(_id);
        socket.emit("unwatch-user", _id);
      } else {
        watchCountsRef.current.set(_id, count - 1);
      }
    });
  };

  const getPresence = (user_id) =>
    presence[user_id] || { online: false, lastSeen: null };

  const value = useMemo(
    () => ({
      presence,
      watchUser,
      unwatchUser,
      watchUsers,
      unwatchUsers,
      getPresence,
    }),
    [presence],
  );

  return (
    <PresenceContext.Provider value={value}>
      {children}
    </PresenceContext.Provider>
  );
}

export function usePresence() {
  return useContext(PresenceContext);
}
