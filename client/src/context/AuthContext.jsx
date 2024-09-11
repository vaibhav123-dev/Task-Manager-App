import { createContext, useState, useEffect } from "react";
import { setUser } from "../redux/slices/userSlice";

// Create UserContext
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, addUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [fetchTask, setFetchTask] = useState(false);
  const [fetchUser, setFetchUser] = useState(false);

  // Check localStorage for saved user data on mount (for persistence)
  useEffect(() => {
    const savedUser = localStorage.getItem("userInfo");
    if (savedUser) {
      addUser(JSON.parse(savedUser));
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

  const loadTask = (value) => {
    setFetchTask(false);
    setTimeout(() => {
      setFetchTask(value);
    }, 0);
  };

  const loadUser = (value) => {
    setFetchUser(false);
    setTimeout(() => {
      setFetchUser(value);
    }, 0);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        loadTask,
        fetchTask,
        loadUser,
        fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
