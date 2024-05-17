import React, { createContext, useContext, useEffect, useState } from 'react';
import { SessionUser } from '../models/Session';
import { getCurrentSessionUser } from '../services/UserService';

interface SessionContextType {
  currentUser: SessionUser | null;
  refreshSession: () => void;
  isSignedIn: () => boolean;
  isAdmin: () => boolean;
  isCustomer: () => boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children } : {children: any}) => {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);

  const isSignedIn = () => currentUser !== null;
  const isAdmin = () => isSignedIn() && currentUser?.roleId === 'admin';
  const isCustomer = () => isSignedIn() && currentUser?.roleId === 'customer';

  const refreshSession = async () => {
    console.log('Refreshing session...');
    getCurrentSessionUser().then((user) => {
      setCurrentUser(user);
    });
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <SessionContext.Provider
      value={{ currentUser, refreshSession, isSignedIn, isAdmin, isCustomer }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
