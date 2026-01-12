import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { api } from "../lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  role: "teacher" | "student";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string, profileImage?: string) => void;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.auth.getSession();
      if (response.data?.user && response.data.user.role === "teacher") {
        setUser({
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          profileImage: response.data.user.image,
          role: response.data.user.role,
        });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.auth.signIn(email, password);

    if (response.data.success) {
      await checkAuth();
    } else {
      throw new Error(response.data.error?.message || "Login failed");
    }
  };

  const logout = async () => {
    try {
      await api.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateProfile = (name: string, profileImage?: string) => {
    if (user) {
      setUser({ ...user, name, profileImage });
    }
  };

  const updatePassword = async () => {
    // TODO: Implement password update API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Password updated");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, updateProfile, updatePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
