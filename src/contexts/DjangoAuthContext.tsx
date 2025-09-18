import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, User, LoginCredentials, RegisterData } from '../services/api';

interface DjangoAuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  changePassword: (passwordData: { current_password: string; new_password: string }) => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const DjangoAuthContext = createContext<DjangoAuthContextType | undefined>(undefined);

export const DjangoAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (apiClient.isAuthenticated()) {
        try {
          const response = await apiClient.getProfile();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            // Invalid token, clear it
            apiClient.removeTokens();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          apiClient.removeTokens();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.login(credentials);
      
      if (response.success && response.data) {
        const { user: userData, tokens } = response.data;
        
        // Store tokens
        apiClient.setAuthToken(tokens.access);
        apiClient.setRefreshToken(tokens.refresh);
        
        // Set user
        setUser(userData);
        return true;
      } else {
        setError(response.message || 'Login failed');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.register(userData);
      
      if (response.success && response.data) {
        const { user: newUser, tokens } = response.data;
        
        // Store tokens
        apiClient.setAuthToken(tokens.access);
        apiClient.setRefreshToken(tokens.refresh);
        
        // Set user
        setUser(newUser);
        return true;
      } else {
        setError(response.message || 'Registration failed');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const refreshToken = apiClient.getRefreshToken();
      if (refreshToken) {
        await apiClient.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state and tokens
      apiClient.removeTokens();
      setUser(null);
      setError(null);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.updateProfile(userData);
      
      if (response.success && response.data) {
        setUser(response.data);
        return true;
      } else {
        setError(response.message || 'Profile update failed');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Profile update failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (passwordData: { 
    current_password: string; 
    new_password: string 
  }): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.changePassword(passwordData);
      
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Password change failed');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Password change failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
    isLoading,
    error,
  };

  return (
    <DjangoAuthContext.Provider value={value}>
      {children}
    </DjangoAuthContext.Provider>
  );
};

export const useDjangoAuth = () => {
  const context = useContext(DjangoAuthContext);
  if (context === undefined) {
    throw new Error('useDjangoAuth must be used within a DjangoAuthProvider');
  }
  return context;
};
