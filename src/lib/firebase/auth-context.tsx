"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { auth, db } from "./client";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getUserProfile, signOutUser, checkIsAdmin, UserProfile, UserRole } from "./auth";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isEntrepreneur: boolean;
  isInvestor: boolean;
  hasBothRoles: boolean;
  hasInvestorProfile: boolean;
  isAdmin: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: null,
  isEntrepreneur: false,
  isInvestor: false,
  hasBothRoles: false,
  hasInvestorProfile: false,
  isAdmin: false,
  loading: true,
  isAuthenticated: false,
  signOut: async () => ({ error: null }),
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hasInvestorProfile, setHasInvestorProfile] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (currentUser: User | null) => {
    if (!currentUser) {
      setProfile(null);
      setIsAdmin(false);
      setHasInvestorProfile(false);
      return;
    }
    const { profile: userProfile } = await getUserProfile(currentUser.uid);
    setProfile(userProfile);
    const adminStatus = await checkIsAdmin(currentUser, userProfile);
    setIsAdmin(adminStatus);

    try {
      const invRef = doc(db, "investorProfiles", currentUser.uid);
      const invSnap = await getDoc(invRef);
      setHasInvestorProfile(invSnap.exists());
    } catch {
      setHasInvestorProfile(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      await fetchProfile(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const res = await signOutUser();
    if (!res.error) {
      setUser(null);
      setProfile(null);
      setHasInvestorProfile(false);
    }
    return res;
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  const userRole = profile?.role || null;
  const rolesList: UserRole[] = Array.isArray(profile?.roles)
    ? profile.roles
    : userRole
    ? [userRole]
    : [];

  const isInvestor =
    !!user &&
    (userRole === "investor" ||
      rolesList.includes("investor") ||
      hasInvestorProfile ||
      profile?.hasJoinedInvestor === true);

  const isEntrepreneur =
    !!user &&
    (userRole === "entrepreneur" ||
      rolesList.includes("entrepreneur") ||
      profile?.hasJoinedEntrepreneur === true);

  const hasBothRoles = !!user && isInvestor && isEntrepreneur;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: userRole,
        isEntrepreneur,
        isInvestor,
        hasBothRoles,
        hasInvestorProfile,
        isAdmin,
        loading,
        isAuthenticated: !!user,
        signOut: handleSignOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
