"use client";
import { fetchAuthSession } from "aws-amplify/auth";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  Dispatch,
} from "react";

interface AuthContextType {
  isSignedIn: Boolean | undefined;
  setIsSignedIn: (signedIn: Boolean | undefined) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState<Boolean>();

  useEffect(() => {
    async function getAuthStatus() {
      const session = await fetchAuthSession();
      if (!session.tokens) {
        setIsSignedIn(false);
      } else {
        setIsSignedIn(true);
      }
    }

    getAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
