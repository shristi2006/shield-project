import { createContext, useEffect } from "react";
import { socket } from "@/sockets/socket";
import { useAuth } from "@/hooks/useAuth";

export const SocketContext = createContext<typeof socket>(socket);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth() as { token: string };

  useEffect(() => {
    if (token) {
      socket.auth = { token };
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
