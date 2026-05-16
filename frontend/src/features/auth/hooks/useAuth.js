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
        name: payload.name || "",
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
   * Create a new account. phoneNumber and whatsappNotifications are optional.
   * @param {{ name: string, email: string, password: string, phoneNumber?: string, whatsappNotifications?: boolean }} values
   */
  const signup = async (values) => {
    try {
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        emailNotifications: values.emailNotifications ?? false,
        ...(values.phoneNumber ? { phoneNumber: values.phoneNumber } : {}),
      };
      const response = await api.post("/auth/signup", payload);
      const { access_token } = response.data;
      const jwtPayload = JSON.parse(atob(access_token.split(".")[1]));
      const newUser = {
        id: jwtPayload.sub,
        email: jwtPayload.email,
        role: jwtPayload.role,
        name: values.name,
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
