import { useAuthStore } from "@/store/useAuthStore";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAuth = () => {
  const {
    user,
    accessToken,
    isAuthenticated,
    setAuth,
    logout: clearAuth,
  } = useAuthStore();
  const navigate = useNavigate();

  /**
   * Sign in using email OR phone number (identifier) plus password.
   * @param {{ identifier: string, password: string }} values
   */
  const login = async (values) => {
    try {
      const response = await api.post("/auth/signin", {
        identifier: values.identifier,
        password: values.password,
      });
      const { access_token } = response.data;
      const payload = JSON.parse(atob(access_token.split(".")[1]));
      const loggedInUser = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        fullName: payload.fullName || "",
        phoneNumber: payload.phoneNumber || "",
        dateOfBirth: payload.dateOfBirth || null,
      };
      setAuth(loggedInUser, access_token);
      toast.success("Welcome back! 🌸");
      navigate("/dashboard");
    } catch (error) {
      const msg = error.response?.data?.message;
      const text = Array.isArray(msg) ? msg.join(". ") : msg || "Login failed";
      toast.error(text);
    }
  };

  /**
   * Create a new account. phoneNumber and emailNotifications are optional.
   * @param {{ fullName: string, email: string, password: string, dateOfBirth: string, phoneNumber?: string, emailNotifications?: boolean }} values
   */
  const signup = async (values) => {
    try {
      const payload = {
        fullName: values.fullName,
        email: values.email,
        dateOfBirth: values.dateOfBirth,
        password: values.password,
        emailNotifications: values.emailNotifications ?? true,
        ...(values.phoneNumber ? { phoneNumber: values.phoneNumber } : {}),
      };
      const response = await api.post("/auth/signup", payload);
      const { access_token } = response.data;
      const jwtPayload = JSON.parse(atob(access_token.split(".")[1]));
      const newUser = {
        id: jwtPayload.sub,
        email: jwtPayload.email,
        role: jwtPayload.role,
        fullName: values.fullName,
        phoneNumber: jwtPayload.phoneNumber || "",
        dateOfBirth: jwtPayload.dateOfBirth || null,
      };
      setAuth(newUser, access_token);
      toast.success("Account created! Welcome to CycleWell 🌸");
      navigate("/dashboard");
    } catch (error) {
      const msg = error.response?.data?.message;
      const text = Array.isArray(msg) ? msg.join(". ") : msg || "Signup failed";
      toast.error(text);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      clearAuth();
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  return {
    user,
    accessToken,
    isAuthenticated,
    login,
    signup,
    logout,
  };
};
