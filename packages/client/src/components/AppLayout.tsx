import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-grow bg-gray-800 text-white">
        <Outlet/>
      </div>
    </div>
  );
};