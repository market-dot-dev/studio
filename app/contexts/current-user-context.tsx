import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
  useEffect,
} from 'react';
import { getCurrentSessionUser } from '../services/UserService';
import { SessionUser } from '../models/Session';

interface CurrentSessionContextType {
  currentSessionUser: SessionUser | undefined;
  refreshCurrentSessionUser: () => Promise<SessionUser | undefined>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const CurrentSessionContext = createContext<
  CurrentSessionContextType | undefined
>(undefined);

export const CurrentSessionProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [currentSessionUser, setCurrentSessionUser] = useState<SessionUser>();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCurrentUser = async (): Promise<SessionUser | undefined> => {
    try {
      setIsLoading(true);
      const fetchedUser = await getCurrentSessionUser();
      
      if (fetchedUser) {
        setCurrentSessionUser(fetchedUser);
        setIsAuthenticated(true);
        return fetchedUser;
      } else {
        setCurrentSessionUser(undefined);
        setIsAuthenticated(false);
      }
    } catch (err) {
      setCurrentSessionUser(undefined);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCurrentSessionUser = async () => fetchCurrentUser();

  const restoreSession = async () => {
    refreshCurrentSessionUser();
  };

  useEffect(() => {
    void restoreSession();
  }, []);

  return (
    <CurrentSessionContext.Provider
      value={{
        currentSessionUser,
        refreshCurrentSessionUser,
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
