import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
  sendEvent: (event: string, data?: any) => void;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connect: () => {},
  disconnect: () => {},
  sendEvent: (event: string, data?: any) => {},
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const newSocket = io('http://localhost:8080', {
      autoConnect: false,
      auth: {
        token: `Bearer ${token}`,
      }
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  const connect = () => {
    if (socket && !isConnected) {
      console.log('Connecting to socket...');
      socket.connect();
    }
  };

  const disconnect = () => {
    if (socket && isConnected) {
      socket.disconnect();
    }
  };

  const sendEvent = (event: string, data?: any) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    } else {
      console.error(`Socket is not connected. Event '${event}' not sent.`);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, connect, disconnect, sendEvent, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
