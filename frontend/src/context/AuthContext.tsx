import React, { createContext, useState, useEffect, useContext } from "react";

type User = {
  name: string | null;
  token: string | null;
  id: string | null;
};

type AuthContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({ name: null, token: null, id: null });

  useEffect(() => {
    const name = localStorage.getItem("MMK_U_name");
    const token = localStorage.getItem("MMK_U_token");
    const id = localStorage.getItem("MMK_U_user_id");

    if (name && token && id) {
      setUser({ name, token, id });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser({ name: null, token: null, id: null });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
