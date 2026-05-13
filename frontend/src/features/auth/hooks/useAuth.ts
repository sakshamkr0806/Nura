import { useAuthStore } from '@/store/useAuthStore';
import api from '@/api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useAuth = () => {
  const { user, accessToken, isAuthenticated, setAuth, logout: clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const login = async (values: any) => {
    try {
      const response = await api.post('/auth/signin', values);
      const { access_token } = response.data;
      const payload = JSON.parse(atob(access_token.split('.')[1]));
      const user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        name: payload.name || '',
      };
      setAuth(user, access_token);
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  const signup = async (values: any) => {
    try {
      const response = await api.post('/auth/signup', values);
      const { access_token } = response.data;
      const payload = JSON.parse(atob(access_token.split('.')[1]));
      const user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        name: values.name,
      };
      setAuth(user, access_token);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Signup failed');
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      clearAuth();
      toast.success('Logged out successfully');
      navigate('/login');
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
