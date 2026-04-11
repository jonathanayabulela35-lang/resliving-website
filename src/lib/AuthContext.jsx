import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      if (data.session?.user) {
        const current = await api.auth.getUser();
        if (mounted) setUser(current);
      }
      if (mounted) setIsLoadingAuth(false);
    }).catch(() => {
      if (mounted) setIsLoadingAuth(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const current = await api.auth.getUser();
        if (mounted) setUser(current);
      } else if (mounted) {
        setUser(null);
      }
      if (mounted) setIsLoadingAuth(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoadingAuth,
    login: api.auth.signIn,
    signup: api.auth.signUp,
    logout: api.auth.signOut,
  }), [user, isLoadingAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
