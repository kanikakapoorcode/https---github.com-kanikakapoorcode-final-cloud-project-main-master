import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('fms_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email) => {  // Removed unused password parameter
    // Mock login - replace with actual API call
    const mockUser = {
      email,
      user_id: 'mock123',
      isAuthenticated: true
    };
    localStorage.setItem('fms_user', JSON.stringify(mockUser));
    setUser(mockUser);
    navigate('/dashboard');
    return { success: true };
  };

  const signup = async () => {  // Removed unused userData parameter
    // Mock signup - replace with actual API call
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('fms_user');
    setUser(null);
    navigate('/auth/login');
  };

  const authValue = {  // Moved context value to a variable
    user, 
    loading, 
    login, 
    signup, 
    logout
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Moved useAuth to a separate file to fix react-refresh warning
export { AuthContext };