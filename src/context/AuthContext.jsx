import React, { createContext, useContext, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(() => {
    const stored = localStorage.getItem("customerInfo");
    return stored ? JSON.parse(stored) : null;
  });

  const persist = (data) => {
    localStorage.setItem("customerToken", data.token);
    localStorage.setItem("customerInfo", JSON.stringify(data));
    setCustomer(data);
  };

  const register = async ({ name, email, password, phone }) => {
    const { data } = await api.post("/users/register", { name, email, password, phone });
    persist(data.data);
    return data.data;
  };

  const login = async ({ email, password }) => {
    const { data } = await api.post("/users/login", { email, password });
    persist(data.data);
    return data.data;
  };

  const logout = () => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customerInfo");
    setCustomer(null);
  };

  return (
    <AuthContext.Provider value={{ customer, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};