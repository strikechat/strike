import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = () => {
  return (
    <div className="flex h-screen bg-background-primary">
      <Sidebar />
      <div className="flex-grow text-white">
        <Outlet/>
      </div>
    </div>
  );
};
