import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
  useEffect,
} from 'react';
import { User } from '@prisma/client';
import { getCurrentUser } from '@/app/services/UserService';

interface Session {
  user: User | undefined;
}

interface CurrentSessionContextType {
  currentSession: Session;
  refreshCurrentSession: () => Promise<Session | undefined>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const CurrentSessionContext = createContext<
  CurrentSessionContextType | undefined
>(undefined);

export const CurrentSessionProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [currentSession, setCurrentSession] = useState<Session>({
    user: undefined,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCurrentUser = async (): Promise<Session | undefined> => {
    try {
      setIsLoading(true);
      const fetchedUser = await getCurrentUser();
      
      if (fetchedUser) {
        const session = { user: fetchedUser };
        setCurrentSession(session);
        setIsAuthenticated(true);
        return session;
      }
    } catch (err) {
      setCurrentSession({ user: undefined });
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCurrentSession = async () => fetchCurrentUser();

  /*
  const restoreSession = async () => {
  };

  useEffect(() => {
    void restoreSession();
  }, []);
  */

  return (
    <CurrentSessionContext.Provider
      value={{
        currentSession,
        refreshCurrentSession,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </CurrentSessionContext.Provider>
  );
};

const useCurrentSession = () => {
  const context = useContext(CurrentSessionContext);

  if (!context) {
    throw new Error(
      'useCurrentSession must be used within a CurrentSessionProvider'
    );
  }

  return context;
};

export default useCurrentSession;
