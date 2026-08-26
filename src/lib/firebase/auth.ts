import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./client";

export type UserRole = "investor" | "entrepreneur";

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone?: string;
  location?: string;
  role: UserRole;
  companyName?: string;
  sector?: string;
  createdAt?: unknown;
}

/**
 * Sign in existing user with email and password
 */
export async function signInUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Fetch profile if exists
    let profile: UserProfile | null = null;
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        profile = docSnap.data() as UserProfile;
      }
    } catch {
      // Ignore firestore read if offline/unconfigured
    }

    return { user, profile, error: null };
  } catch (err: unknown) {
    const error = err as { message?: string; code?: string };
    return { user: null, profile: null, error: error.message || "Failed to sign in" };
  }
}

/**
 * Sign up a new user and create their profile document
 */
export async function signUpUser(
  email: string,
  password: string,
  profileData: Omit<UserProfile, "uid" | "email" | "createdAt">
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const fullProfile: UserProfile = {
      uid: user.uid,
      email: user.email || email,
      ...profileData,
    };

    try {
      await setDoc(doc(db, "users", user.uid), {
        ...fullProfile,
        createdAt: serverTimestamp(),
      });
    } catch {
      // Ignore firestore write if offline/unconfigured
    }

    return { user, profile: fullProfile, error: null };
  } catch (err: unknown) {
    const error = err as { message?: string; code?: string };
    return { user: null, profile: null, error: error.message || "Failed to create account" };
  }
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { error: error.message || "Failed to sign out" };
  }
}

/**
 * Send password reset email
 */
export async function resetUserPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { error: error.message || "Failed to send reset link" };
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
