import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getCurrentUser()
      .then((res) => {
        setUser(res?.data?.user || null);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });

    const unsubscribe = supabase.auth.onAuthStateChange((event) => {
      if (event === 'signedOut' || event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'signedIn' || event === 'SIGNED_IN' || event === 'tokenRefreshed') {
        supabase.auth.getCurrentUser()
          .then((res) => {
            setUser(res?.data?.user || null);
          })
          .catch(() => {});
      }
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithGoogle();
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const verifyEmail = async (email, otp) => {
    const { data, error } = await supabase.auth.verifyEmail({ email, otp });
    if (error) throw error;
    const res = await supabase.auth.getCurrentUser();
    setUser(res?.data?.user || null);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signInWithGoogle, signOut, verifyEmail, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
