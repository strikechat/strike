import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserController } from '../UserController';

interface ServerContextType {
  servers: any[];
  fetchServers: () => Promise<void>;
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

export const ServerProvider = ({ children }: { children: ReactNode }) => {
  const [servers, setServers] = useState<any[]>([]);

  const fetchServers = async () => {
    const fetchedServers = await UserController.getServers();
    setServers(fetchedServers);
  };

  useEffect(() => {
    fetchServers();
  }, []);

  return (
    <ServerContext.Provider value={{ servers, fetchServers }}>
      {children}
    </ServerContext.Provider>
  );
};

export const useServer = (): ServerContextType => {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error('useServer must be used within a ServerProvider');
  }
  return context;
};