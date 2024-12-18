import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import { App as MainApp } from './pages/app/App.tsx';
import './index.css';
import { LoginPage } from './pages/auth/LoginPage.tsx';
import { AppLayout } from './components/AppLayout.tsx';
import { ServerLayout } from './components/ServerLayout.tsx';
import { ChannelView } from './components/ChannelView.tsx';
import { ModalProvider } from './lib/context/ModalContext.tsx';
import { Modal } from './components/Modal.tsx';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n.ts';
import { Toaster } from 'react-hot-toast';
import { ServerProvider } from './lib/context/ServerContext.tsx';
import SocketProvider from './lib/context/SocketContext.tsx';
import Translations from './components/Translations.tsx';
import { RegisterPage } from './pages/auth/RegisterPage.tsx';
import { ServerSettings } from './pages/app/Server/ServerSettings.tsx';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage/>
  },
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      {
        path: '',
        element: <MainApp />
      }
    ]
  },
  {
    path: '/server/:serverId',
    element: <AppLayout />,
    children: [
      {
        path: '',
        element: <ServerLayout />,
        children: [
          {
            path: 'channel/:channelId',
            element: <ChannelView />
          }
        ]
      }
    ]
  },
  {
    path: '/server/:serverId/settings',
    element: <ServerSettings />
  },
  {
    path: '/translations',
    element: <AppLayout />,
    children: [
      {
        path: '',
        element: <Translations />,
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster position="bottom-right" toastOptions={{
      style: {
        borderRadius: '2rem',
        background: '#191824',
        color: '#fff',
      },
    }}/>
    <I18nextProvider i18n={i18n}>
      <SocketProvider>
        <ServerProvider>
          <ModalProvider>
            <Modal />
            <RouterProvider router={routes} />
          </ModalProvider>
        </ServerProvider>
      </SocketProvider>
    </I18nextProvider>
  </React.StrictMode>
);
