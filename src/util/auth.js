// utils/auth.js
import {jwtDecode} from "jwt-decode";

export const getValidToken = (navigate) => {
  const token = localStorage.getItem("Token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000; // seconds

    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem("Token");
      localStorage.removeItem("userId");
      localStorage.removeItem("loggedInuser");
      navigate("/login");
      return null;
    }

    return token;
  } catch (error) {
    console.error("Invalid token format", error);
    localStorage.removeItem("Token");
    navigate("/login");
    return null;
  }
};
