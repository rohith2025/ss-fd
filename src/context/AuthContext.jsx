import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  const login = async (jwtToken, userRole) => {
    // Store auth basics
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("role", userRole);
    setToken(jwtToken);
    setRole(userRole);

    // 🔑 EXTRA STEP ONLY FOR PARENT
    if (userRole === "parent") {
      try {
        /**
         * Decode JWT to get parentId
         * JWT payload is base64 encoded
         */
        const payload = JSON.parse(
          atob(jwtToken.split(".")[1])
        );
        const parentId = payload.id;

        /**
         * Fetch UserLink data
         * We already have admin/users endpoint
         * Backend unchanged
         */
        const res = await api.get("/admin/users");

        const parentLink = res.data.find(
          (link) => link.parent === parentId
        );

        if (parentLink?.student) {
          localStorage.setItem(
            "studentId",
            parentLink.student
          );
        }
      } catch (error) {
        console.error(
          "Failed to resolve parent student link",
          error
        );
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("studentId"); // 🔑 cleanup
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
