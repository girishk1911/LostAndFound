// import React, { createContext, useState, useEffect } from 'react';
// import { jwtDecode } from 'jwt-decode';
// import { login, logout } from '../services/authService';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
    
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         const currentTime = Date.now() / 1000;
        
//         if (decoded.exp < currentTime) {
//           // Token expired
//           handleLogout();
//         } else {
//           setUser(decoded);
//         }
//       } catch (error) {
//         console.error('Invalid token', error);
//         handleLogout();
//       }
//     }
    
//     setLoading(false);
//   }, []);

//   const handleLogin = async (email, password) => {
//     try {
//       const data = await login(email, password);
      
//       if (data.token) {
//         localStorage.setItem('token', data.token);
//         const decoded = jwtDecode(data.token);
//         setUser(decoded);
//         return { success: true };
//       }
//     } catch (error) {
//       return { 
//         success: false, 
//         message: error.response?.data?.message || 'Login failed' 
//       };
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     localStorage.removeItem('token');
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider 
//       value={{ 
//         user, 
//         loading, 
//         login: handleLogin, 
//         logout: handleLogout,
//         isAuthenticated: !!user
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login function to be used by Login component
  const login = useCallback((username, password) => {
    return new Promise((resolve, reject) => {
      // Check against hardcoded credentials
      if (username === "pict_guard" && password === "secure@guard123") {
        // Create a mock token for development
        const userData = {
          username: "pict_guard",
          role: "guard",
          token: "dev-jwt-token-for-guard-auth" // In production, get from backend
        };
        
        // Store in localStorage for API requests
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        resolve(userData);
      } else {
        reject(new Error("Invalid credentials"));
      }
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // Add a redirect to home page if needed
    window.location.href = '/';
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem('token');
  }, []);

  const isGuard = useCallback(() => {
    return user?.role === 'guard';
  }, [user]);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        // In production, verify token validity here
        setUser(JSON.parse(userData));
      } catch (error) {
        // Invalid user data in localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        isGuard,
        isSecurityGuard: isGuard // Alias for backward compatibility
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
