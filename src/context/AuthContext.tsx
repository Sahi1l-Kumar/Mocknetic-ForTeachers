import { createContext, useState } from "react";
import type { ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string, profileImage?: string) => void;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock user data
    setUser({
      id: "1",
      name: "Teacher Name",
      email: email,
      profileImage: undefined,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (name: string, profileImage?: string) => {
    if (user) {
      setUser({ ...user, name, profileImage });
    }
  };

  const updatePassword = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Password updated");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateProfile, updatePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Move useAuth hook to a separate file to fix Fast Refresh warning
// Export context for use in hooks file
export { AuthContext };
