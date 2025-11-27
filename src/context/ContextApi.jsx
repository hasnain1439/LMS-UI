// ContextApi.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Named export for context
export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/profile", {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err) {
      console.log(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, fetchUser, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};
