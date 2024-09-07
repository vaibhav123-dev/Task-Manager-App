import { createContext, useState, useEffect } from "react";

// Create UserContext
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  // Check localStorage for saved user data on mount (for persistence)
  useEffect(() => {
    const savedUser = localStorage.getItem("userInfo");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false); // Stop loading after checking
  }, []);

  // Function to handle login
  const login = (userData) => {
    localStorage.setItem("userInfo", JSON.stringify(userData));
    setUser(userData);
  };

  // Function to handle logout
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
