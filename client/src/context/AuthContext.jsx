import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isConfigured } from '../services/supabase';

const AuthContext = createContext(null);

const DEMO_USERS = {
  'student@campus.edu': {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'student@campus.edu',
    display_name: 'Alex Johnson (Student)',
    role: 'student',
    department: 'Computer Science',
  },
  'moderator@campus.edu': {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'moderator@campus.edu',
    display_name: 'Campus Security Officer (Moderator)',
    role: 'moderator',
    department: 'North Gate Custody',
  },
  'admin@campus.edu': {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'admin@campus.edu',
    display_name: 'Dr. Evans (Administrator)',
    role: 'admin',
    department: 'Campus Administration',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore any saved demo session or Supabase session on startup
  useEffect(() => {
    const savedDemo = localStorage.getItem('smart_lost_found_demo_user');
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        setUser({ id: parsed.id, email: parsed.email });
        setProfile(parsed);
        setSession({ access_token: `demo-jwt-${parsed.role}` });
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem('smart_lost_found_demo_user');
      }
    }

    if (isConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });
    } else {
      // Default to logged-in student persona for instantaneous demonstration!
      const defaultUser = DEMO_USERS['student@campus.edu'];
      setUser({ id: defaultUser.id, email: defaultUser.email });
      setProfile(defaultUser);
      setSession({ access_token: 'demo-jwt-student' });
      localStorage.setItem('smart_lost_found_demo_user', JSON.stringify(defaultUser));
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    // If using live remote Supabase
    if (isConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setSession(data.session);
        setUser(data.user);
        return data;
      } catch (err) {
        console.warn('Supabase remote signin failed, checking demo persona fallback:', err.message);
      }
    }

    // Demo persona fallback
    const matched = DEMO_USERS[cleanEmail] || {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      display_name: cleanEmail.split('@')[0],
      role: 'student',
      department: 'General Studies',
    };

    setUser({ id: matched.id, email: matched.email });
    setProfile(matched);
    setSession({ access_token: `demo-jwt-${matched.role}` });
    localStorage.setItem('smart_lost_found_demo_user', JSON.stringify(matched));
    return { user: matched };
  };

  const register = async ({ email, password, displayName, role = 'student', department }) => {
    const cleanEmail = email.trim().toLowerCase();

    if (isConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName, role, department } },
        });
        if (!error && data?.user) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase remote register fallback:', err.message);
      }
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      display_name: displayName || cleanEmail.split('@')[0],
      role,
      department: department || 'General',
    };

    setUser({ id: newUser.id, email: newUser.email });
    setProfile(newUser);
    setSession({ access_token: `demo-jwt-${role}` });
    localStorage.setItem('smart_lost_found_demo_user', JSON.stringify(newUser));
    return { user: newUser };
  };

  const logout = async () => {
    if (isConfigured) {
      await supabase.auth.signOut().catch(() => {});
    }
    localStorage.removeItem('smart_lost_found_demo_user');
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const isRole = (roles) => {
    if (!profile) return false;
    const allowed = Array.isArray(roles) ? roles : [roles];
    return allowed.includes(profile.role);
  };

  const value = {
    user,
    profile,
    session,
    loading,
    isConfigured,
    login,
    register,
    logout,
    isRole,
    refreshProfile: async () => {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
