import React, { createContext, useContext, useEffect, useState } from 'react';
import { SessionUser } from '../models/Session';
import { getSession } from 'next-auth/react';

interface SessionContextType {
  currentUser: SessionUser | null;
  refreshSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const ProvisionalSessionProvider = ({ children } : {children: any}) => {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);


  const refreshSession = async () => {
    console.log('Refreshing session...');
    getSession().then((session) => {
      if (session?.user) {
          setCurrentUser(session.user as any);
      } else {
          setCurrentUser(null);
      }
    });
    
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <SessionContext.Provider
      value={{ currentUser, refreshSession }}
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
