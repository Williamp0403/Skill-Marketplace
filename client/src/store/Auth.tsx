import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { setGetTokenFn } from "../lib/axios";

type AppUser = {
  id: string;
  role: "CLIENT" | "PROFESSIONAL";
  name: string | null;
  avatarUrl: string | null;
};

type AuthContextType = {
  loading: boolean;
  user: AppUser | null;
  needsOnboarding: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  loading: true,
  user: null,
  needsOnboarding: false,
  isAuthenticated: false,
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();

  // Registrar getToken de Clerk en la instancia de Axios
  useEffect(() => {
    setGetTokenFn(getToken);
  }, [getToken]);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AppUser | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  const checkUser = useCallback(async () => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setUser(null);
      setNeedsOnboarding(false);
      setLoading(false);
      return;
    }

    console.log("user", user);

    try {
      const token = await getToken();

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 404) {
        setNeedsOnboarding(true);
        setUser(null);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error("Error fetching user");
      }

      const data = await res.json();
      console.log("data", data);
      setUser(data);
      setNeedsOnboarding(false);
      setLoading(false);
    } catch (error) {
      console.error("Error checking user:", error);
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, getToken]);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    await checkUser();
  }, [checkUser]);

  const isAuthenticated = isSignedIn === true;

  return (
    <AuthContext.Provider
      value={{ loading, user, needsOnboarding, isAuthenticated, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAppAuth = () => useContext(AuthContext);
