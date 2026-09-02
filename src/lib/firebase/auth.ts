import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  deleteUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./client";

export type UserRole = "investor" | "entrepreneur" | "admin";

export interface UserProfile {
  uid: string;
  fullName: string;
  name?: string;
  email: string;
  phone?: string;
  role: UserRole;
  isAdmin?: boolean;
  companyName?: string;
  sector?: string;
  location?: string;
  roles?: UserRole[];
  hasJoinedInvestor?: boolean;
  hasJoinedEntrepreneur?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

/**
 * Format Firebase Auth error codes into clean, human-friendly messages
 */
export function formatFirebaseAuthError(errorCode?: string, fallback = "Authentication failed"): string {
  if (!errorCode) return fallback;

  switch (errorCode) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
    case "auth/invalid-login-credentials":
      return "Incorrect email or password.";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many unsuccessful attempts. Please try again in a few minutes.";
    case "auth/network-request-failed":
      return "Please check your internet connection and try again.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact Wenturex support.";
    case "auth/requires-recent-login":
      return "Please log in again before performing this action.";
    default:
      return fallback;
  }
}

/**
 * Create or set a user profile in Firestore (users/{uid})
 */
export async function createUserProfile(
  uid: string,
  profileData: Omit<UserProfile, "uid" | "createdAt">
): Promise<{ profile: UserProfile | null; error: string | null }> {
  try {
    const fullProfile: UserProfile = {
      uid,
      ...profileData,
    };

    const docRef = doc(db, "users", uid);
    await setDoc(docRef, {
      ...fullProfile,
      createdAt: serverTimestamp(),
    });

    return { profile: fullProfile, error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { profile: null, error: error.message || "Failed to create user profile in database." };
  }
}

/**
 * Get user profile from Firestore (users/{uid})
 */
export async function getUserProfile(uid: string): Promise<{ profile: UserProfile | null; error: string | null }> {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const resolvedName = data.fullName || data.name || "";
      const rawRoles = Array.isArray(data.roles) ? (data.roles as UserRole[]) : undefined;
      const profile: UserProfile = {
        uid,
        fullName: resolvedName,
        name: resolvedName,
        email: data.email || "",
        phone: data.phone || "",
        role: (data.role as UserRole) || "entrepreneur",
        isAdmin: data.role === "admin" || data.isAdmin === true,
        companyName: data.companyName || "",
        sector: data.sector || "",
        location: data.location || "",
        roles: rawRoles,
        hasJoinedInvestor: data.hasJoinedInvestor === true,
        hasJoinedEntrepreneur: data.hasJoinedEntrepreneur === true,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
      return { profile, error: null };
    }

    // Fallback: If no Firestore doc exists yet, initialize from Firebase Auth user
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.uid === uid) {
      const resolvedName = currentUser.displayName || "";
      const fallbackProfile: UserProfile = {
        uid,
        fullName: resolvedName,
        name: resolvedName,
        email: currentUser.email || "",
        phone: currentUser.phoneNumber || "",
        role: "entrepreneur",
        isAdmin: false,
        companyName: "",
        sector: "",
        location: "",
      };
      return { profile: fallbackProfile, error: null };
    }

    return { profile: null, error: "Profile not found." };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { profile: null, error: error.message || "Failed to fetch user profile." };
  }
}

/**
 * Update user profile in Firestore (users/{auth.currentUser.uid})
 * Strictly uses auth.currentUser.uid to ensure User A can never modify User B's profile.
 */
export async function updateUserProfile(
  dataOrUid:
    | string
    | {
        fullName?: string;
        name?: string;
        phone?: string;
        companyName?: string;
        sector?: string;
        location?: string;
      },
  optionalData?: {
    fullName?: string;
    name?: string;
    phone?: string;
    companyName?: string;
    sector?: string;
    location?: string;
  }
): Promise<{ error: string | null; profile?: UserProfile }> {
  try {
    // 1. Strictly obtain the authenticated user from Firebase Auth
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { error: "You must be signed in to update your profile." };
    }

    // Always use the verified authenticated UID - never an arbitrary client-passed UID
    const uid = currentUser.uid;
    const data = typeof dataOrUid === "string" ? (optionalData || {}) : dataOrUid;

    const resolvedName = (data.fullName || data.name || "").trim();
    const docRef = doc(db, "users", uid);

    // Prepare fields to write according to expected Firestore structure
    const updatePayload: Record<string, unknown> = {
      fullName: resolvedName,
      name: resolvedName,
      phone: (data.phone || "").trim(),
      location: (data.location || "").trim(),
      email: currentUser.email || "",
      updatedAt: serverTimestamp(),
    };

    if (data.companyName !== undefined) {
      updatePayload.companyName = data.companyName.trim();
    }
    if (data.sector !== undefined) {
      updatePayload.sector = data.sector.trim();
    }

    // setDoc with { merge: true } creates the document if missing,
    // or updates existing fields while preserving non-form fields (role, createdAt)
    await setDoc(docRef, updatePayload, { merge: true });

    return { error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { error: error.message || "Failed to update profile in database." };
  }
}

/**
 * Sign up a new user (Investor or Entrepreneur) with Email and Password
 */
export async function signUpUser(
  email: string,
  password: string,
  profileData: {
    name?: string;
    fullName?: string;
    phone?: string;
    role: UserRole;
    companyName?: string;
    sector?: string;
    location?: string;
  }
): Promise<{ user: User | null; profile: UserProfile | null; error: string | null }> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    const resolvedName = (profileData.fullName || profileData.name || "").trim();

    const fullProfile: UserProfile = {
      uid: user.uid,
      email: user.email || email.trim(),
      fullName: resolvedName,
      name: resolvedName,
      phone: (profileData.phone || "").trim(),
      role: profileData.role,
      isAdmin: false,
      companyName: (profileData.companyName || "").trim(),
      sector: (profileData.sector || "").trim(),
      location: (profileData.location || "").trim(),
    };

    // Store in Firestore users/{uid}
    try {
      await setDoc(doc(db, "users", user.uid), {
        ...fullProfile,
        isAdmin: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch {
      // In offline/initial build environments, fallback profile still resolves
    }

    return { user, profile: fullProfile, error: null };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    const cleanMsg = formatFirebaseAuthError(error.code, error.message || "Failed to create account.");
    return { user: null, profile: null, error: cleanMsg };
  }
}

/**
 * Sign in existing user with Email and Password & enforce role validation
 */
export async function signInUser(
  email: string,
  password: string,
  expectedRole?: UserRole
): Promise<{ user: User | null; profile: UserProfile | null; error: string | null }> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    // Fetch profile from Firestore
    let profile: UserProfile | null = null;
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        profile = docSnap.data() as UserProfile;
      }
    } catch {
      // Ignore firestore read error if offline
    }

    // Enforce role check if expectedRole is provided
    if (expectedRole && profile && profile.role) {
      if (profile.role !== expectedRole) {
        // Sign out to prevent unauthorized session
        await signOut(auth);

        if (profile.role === "entrepreneur") {
          return {
            user: null,
            profile: null,
            error: "This account is registered as an Entrepreneur. Please use the Entrepreneur login.",
          };
        } else if (profile.role === "investor") {
          return {
            user: null,
            profile: null,
            error: "This account is registered as an Investor. Please use the Investor login.",
          };
        }
      }
    }

    return { user, profile, error: null };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    const cleanMsg = formatFirebaseAuthError(error.code, error.message || "Failed to sign in.");
    return { user: null, profile: null, error: cleanMsg };
  }
}

/**
 * Sign out the currently authenticated user
 */
export async function signOutUser(): Promise<{ error: string | null }> {
  try {
    await signOut(auth);
    return { error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { error: error.message || "Failed to sign out." };
  }
}

/**
 * Get current authenticated user synchronous object
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Send password reset email
 */
export async function resetUserPassword(email: string): Promise<{ error: string | null }> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return { error: null };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    const cleanMsg = formatFirebaseAuthError(error.code, error.message || "Failed to send password reset email.");
    return { error: cleanMsg };
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Permanently delete current user's profile from Firestore and Auth account
 */
export async function deleteUserAccount(): Promise<{ error: string | null; requiresRecentLogin?: boolean }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { error: "No authenticated user found." };
    }

    const uid = user.uid;

    // 1. Delete Firestore user profile document
    try {
      const docRef = doc(db, "users", uid);
      await deleteDoc(docRef);
    } catch {
      // Continue to Auth deletion if firestore doc is already missing
    }

    // 2. Delete Firebase Auth account
    await deleteUser(user);

    return { error: null };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (error.code === "auth/requires-recent-login") {
      return {
        error: "For security reasons, please sign in again before deleting your account.",
        requiresRecentLogin: true,
      };
    }
    return {
      error: "We couldn't delete your account right now. Please try again.",
    };
  }
}

/**
 * Check if the user has administrative privileges
 */
export async function checkIsAdmin(user: User | null, profile?: UserProfile | null): Promise<boolean> {
  if (!user) return false;

  // 1. Check environment variable admin whitelist
  const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
  const adminEmails = adminEmailsEnv
    .split(",")
    .map((e) => e.replace(/['"]/g, "").trim().toLowerCase())
    .filter(Boolean);

  const currentUserEmail = user.email ? user.email.trim().toLowerCase() : "";
  const profileEmail = profile?.email ? profile.email.trim().toLowerCase() : "";

  const isWhitelisted =
    (currentUserEmail && adminEmails.includes(currentUserEmail)) ||
    (profileEmail && adminEmails.includes(profileEmail));

  if (isWhitelisted) {
    return true;
  }

  // 2. Check profile role or flag if provided
  if (profile?.role === "admin" || profile?.isAdmin === true) {
    return true;
  }

  // 3. Check Firestore admins/{uid} or users/{uid} role
  try {
    const adminDocRef = doc(db, "admins", user.uid);
    const adminDocSnap = await getDoc(adminDocRef);
    if (adminDocSnap.exists()) {
      return true;
    }

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      if (data.role === "admin" || data.isAdmin === true) {
        return true;
      }
    }
  } catch {
    // Offline or permissions boundary
  }

  return false;
}

/**
 * Fetch all registered users for Admin panel
 */
export async function getAllUsers(): Promise<{ users: UserProfile[]; error: string | null }> {
  try {
    let querySnapshot;
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      querySnapshot = await getDocs(q);
    } catch {
      querySnapshot = await getDocs(collection(db, "users"));
    }

    const users: UserProfile[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const resolvedName = data.fullName || data.name || "Unnamed User";
      users.push({
        uid: docSnap.id,
        fullName: resolvedName,
        name: resolvedName,
        email: data.email || "",
        phone: data.phone || "",
        role: (data.role as UserRole) || "entrepreneur",
        isAdmin: data.role === "admin" || data.isAdmin === true,
        companyName: data.companyName || "",
        sector: data.sector || "",
        location: data.location || "",
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    return { users, error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { users: [], error: error.message || "Failed to load user directory." };
  }
}

/**
 * Trusted admin-controlled mechanism to grant or revoke admin privileges.
 * Can only be executed by an authenticated administrator.
 */
export async function setAdminPrivilege(
  targetUid: string,
  isAdmin: boolean
): Promise<{ error: string | null }> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { error: "Authentication required." };
    }

    const callerIsAdmin = await checkIsAdmin(currentUser);
    if (!callerIsAdmin) {
      return { error: "Permission denied. Only administrators can modify administrative privileges." };
    }

    // 1. Update user document in users/{targetUid}
    const userRef = doc(db, "users", targetUid);
    await setDoc(userRef, { isAdmin, updatedAt: serverTimestamp() }, { merge: true });

    // 2. Sync admins/{targetUid} collection document
    const adminDocRef = doc(db, "admins", targetUid);
    if (isAdmin) {
      const userSnap = await getDoc(userRef);
      const data = userSnap.data() || {};
      await setDoc(
        adminDocRef,
        {
          uid: targetUid,
          email: data.email || "",
          role: data.role || "investor",
          isAdmin: true,
          grantedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } else {
      await deleteDoc(adminDocRef).catch(() => {});
    }

    return { error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { error: error.message || "Failed to update administrative privilege." };
  }
}

/**
 * Allow an authenticated investor to join also as an entrepreneur
 */
export async function joinAsEntrepreneurRole(): Promise<{ error: string | null }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { error: "You must be signed in to join as an entrepreneur." };
    }
    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      {
        hasJoinedEntrepreneur: true,
        roles: ["investor", "entrepreneur"],
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { error: error.message || "Failed to update entrepreneur role." };
  }
}


