import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

function normalizeUser(rawUser) {
  if (!rawUser) return null;
  return {
    ...rawUser,
    // Keep frontend shape stable across backend payload variations.
    name: rawUser.name ?? rawUser.fullName ?? '',
    role: typeof rawUser.role === 'string' ? rawUser.role : rawUser.role?.name ?? '',
    roleId: rawUser.role?.id ?? rawUser.roleId ?? null,
    organizationId: rawUser.organization?.id ?? rawUser.organizationId ?? null,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const response = await apiClient.get('/auth/me');
      setUser(normalizeUser(response.data));
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    const normalized = normalizeUser(response.data);
    setUser(normalized);
    return normalized;
  };

  const logout = async () => {
    await apiClient.post('/auth/logout');
    setUser(null);
    window.location.href = '/login';
  };

  const register = async (data) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'SUPER_ADMIN' || user?.role === 'ORG_ADMIN',
    refreshUser: fetchMe,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
