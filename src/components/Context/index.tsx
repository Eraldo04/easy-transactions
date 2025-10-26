import { createContext, useState, type ReactNode } from "react";
import type { UserType } from "../shared/Layout/Sidebar";

interface UserContextTypes {
  user?: UserType | null;
  loginUser: (inputData: UserType) => Promise<UserType | null>;
  logout: () => void | undefined;
}

export const UserContext = createContext<UserContextTypes>({
  user: null,
  loginUser: async () => {
    return null;
  },
  logout: () => {},
});

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);

  async function loginUser({ email, password, firstName, lastName }: UserType) {
    const userData = { email, password, firstName, lastName };
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  }

  function logout() {
    localStorage.removeItem("user");
    window.location.reload();
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, loginUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
