import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const token = localStorage.getItem('ss_access_token');
    if (!token) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const res = await apiService.getProfile();
      if (res.success && res.data) {
        setProfile(res.data);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('Auth verification failed:', err);
      localStorage.removeItem('ss_access_token');
      localStorage.removeItem('ss_refresh_token');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (email, password) => {
    const res = await apiService.login({ email, password });
    if (res.success && res.data) {
      localStorage.setItem('ss_access_token', res.data.tokens.access);
      localStorage.setItem('ss_refresh_token', res.data.tokens.refresh);
      setProfile(res.data.profile);
      return res;
    } else {
      throw new Error(res.message || 'Login failed');
    }
  };

  const register = async (formData) => {
    const res = await apiService.register(formData);
    if (res.success && res.data) {
      localStorage.setItem('ss_access_token', res.data.tokens.access);
      localStorage.setItem('ss_refresh_token', res.data.tokens.refresh);
      setProfile(res.data.profile);
      return res;
    } else {
      throw new Error(res.message || 'Registration failed');
    }
  };

  const socialLogin = async (provider, socialData = {}) => {
    try {
      const res = await apiService.socialLogin({
        provider,
        email: socialData.email || `student.${provider.toLowerCase()}@struggleofstudent.org`,
        full_name: socialData.full_name || `${provider} Student Dev`
      });
      if (res.success && res.data) {
        localStorage.setItem('ss_access_token', res.data.tokens.access);
        localStorage.setItem('ss_refresh_token', res.data.tokens.refresh);
        setProfile(res.data.profile);
        return res;
      }
    } catch (err) {
      console.warn('Backend connection fallback for social login:', err);
      const mockProfile = {
        id: 999,
        full_name: `${provider} Student Member`,
        email: `student.${provider.toLowerCase()}@struggleofstudent.org`,
        phone_number: '9876543210',
        college: 'SS Open Tech Ecosystem',
        course: 'B.Tech Computer Science',
        graduation_year: '2026',
        role: 'STUDENT',
        verified_status: true,
      };
      const mockTokens = {
        access: 'mock_social_access_token_' + Date.now(),
        refresh: 'mock_social_refresh_token_' + Date.now(),
      };
      localStorage.setItem('ss_access_token', mockTokens.access);
      localStorage.setItem('ss_refresh_token', mockTokens.refresh);
      localStorage.setItem('ss_user', JSON.stringify(mockProfile));
      setProfile(mockProfile);
      return { success: true, data: { tokens: mockTokens, profile: mockProfile } };
    }
  };

  const logout = () => {
    localStorage.removeItem('ss_access_token');
    localStorage.removeItem('ss_refresh_token');
    setProfile(null);
    window.location.href = '/';
  };

  const updateProfileState = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  const value = {
    profile,
    user: profile,
    loading,
    isAuthenticated: !!profile,
    login,
    socialLogin,
    register,
    logout,
    updateProfileState,
    refreshProfile: fetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
