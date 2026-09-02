import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./client";
import { DEMO_INVESTORS } from "@/lib/constants/investors";

export type InvestorType =
  | "Individual"
  | "Angel Investor"
  | "VC"
  | "Corporate"
  | "Financier";

export type InvestorStatus = "pending" | "published" | "rejected";

export interface InvestorProfile {
  id: string; // Firebase UID
  userId: string;
  investorName: string;
  investorType: InvestorType;
  location: string;
  investmentRange: string;
  preferredSectors: string[];
  investmentStage: string;
  areasOfExpertise: string[];
  shortIntroduction: string;
  experience: string;
  profileImage?: string;
  status: InvestorStatus;
  rejectionReason?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  publishedAt?: unknown;
  isDemo?: boolean;
}

export interface InvestorEnquiry {
  id?: string;
  investorId: string;
  investorName: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt?: unknown;
}

export const INVESTOR_TYPES: InvestorType[] = [
  "Individual",
  "Angel Investor",
  "VC",
  "Corporate",
  "Financier",
];

export const INVESTMENT_STAGES = [
  "Idea / Proof of Concept",
  "Seed / Early Stage",
  "Growth / Expansion",
  "Series A / Series B",
  "Pre-IPO / Late Stage",
  "Turnaround / Distress",
  "Any Stage",
];

export const INVESTOR_RANGES = [
  "₹5L – ₹25L",
  "₹25L – ₹50L",
  "₹50L – ₹1 Cr",
  "₹1 Cr – ₹5 Cr",
  "₹5 Cr – ₹10 Cr",
  "₹10 Cr+",
];

/**
 * Normalizes raw Firestore document to valid InvestorProfile
 */
export function normalizeInvestorProfile(
  id: string,
  raw: Record<string, unknown>
): InvestorProfile {
  const rawStatus = (raw.status || "pending").toString().toLowerCase().trim();
  let status: InvestorStatus = "pending";
  if (rawStatus === "published" || rawStatus === "approved") {
    status = "published";
  } else if (rawStatus === "rejected" || rawStatus === "declined") {
    status = "rejected";
  }

  const preferredSectors = Array.isArray(raw.preferredSectors)
    ? (raw.preferredSectors as string[])
    : typeof raw.preferredSectors === "string"
    ? (raw.preferredSectors as string).split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const areasOfExpertise = Array.isArray(raw.areasOfExpertise)
    ? (raw.areasOfExpertise as string[])
    : typeof raw.areasOfExpertise === "string"
    ? (raw.areasOfExpertise as string).split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return {
    id,
    userId: (raw.userId as string) || id,
    investorName: (raw.investorName as string) || (raw.name as string) || "Private Investor",
    investorType: (raw.investorType as InvestorType) || "Angel Investor",
    location: (raw.location as string) || "India",
    investmentRange: (raw.investmentRange as string) || "₹25L – ₹50L",
    preferredSectors: preferredSectors.length > 0 ? preferredSectors : ["Technology", "Healthcare"],
    investmentStage: (raw.investmentStage as string) || "Seed / Early Stage",
    areasOfExpertise: areasOfExpertise.length > 0 ? areasOfExpertise : ["Strategy", "Scaling"],
    shortIntroduction: (raw.shortIntroduction as string) || "Experienced investor backing high-growth opportunities.",
    experience: (raw.experience as string) || (raw.shortIntroduction as string) || "",
    profileImage: (raw.profileImage as string) || undefined,
    status,
    rejectionReason: (raw.rejectionReason as string) || undefined,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    publishedAt: raw.publishedAt,
  };
}

/**
 * Fetch the authenticated investor's own directory profile (investorProfiles/{uid})
 */
export async function getMyInvestorProfile(
  uid: string
): Promise<{ profile: InvestorProfile | null; error: string | null }> {
  try {
    const docRef = doc(db, "investorProfiles", uid);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return { profile: null, error: null };
    }
    return {
      profile: normalizeInvestorProfile(snap.id, snap.data()),
      error: null,
    };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { profile: null, error: error.message || "Failed to load investor profile." };
  }
}

/**
 * Create or update authenticated investor profile (stores in investorProfiles/{uid})
 * Forces status = "pending" for admin review
 */
export async function saveInvestorProfile(
  uid: string,
  profileData: Omit<InvestorProfile, "id" | "userId" | "status" | "createdAt" | "updatedAt" | "publishedAt">
): Promise<{ error: string | null }> {
  try {
    const user = auth.currentUser;
    if (!user || user.uid !== uid) {
      return { error: "You must be signed in to update your investor profile." };
    }

    const docRef = doc(db, "investorProfiles", uid);
    const existingSnap = await getDoc(docRef);
    const isNew = !existingSnap.exists();

    if (!isNew) {
      const existingData = existingSnap.data();
      const existingStatus = (existingData?.status || "").toString().toLowerCase().trim();
      if (existingStatus === "pending") {
        return {
          error: "Your investor profile is currently under administrative review. Submissions are paused until review is complete.",
        };
      }
    }

    const payload: Record<string, unknown> = {
      userId: uid,
      investorName: profileData.investorName.trim(),
      investorType: profileData.investorType,
      location: profileData.location.trim(),
      investmentRange: profileData.investmentRange,
      preferredSectors: profileData.preferredSectors,
      investmentStage: profileData.investmentStage,
      areasOfExpertise: profileData.areasOfExpertise,
      shortIntroduction: profileData.shortIntroduction.trim(),
      experience: profileData.experience.trim(),
      status: "pending", // Always pending review on submission
      updatedAt: serverTimestamp(),
    };

    if (profileData.profileImage?.trim()) {
      payload.profileImage = profileData.profileImage.trim();
    }

    if (isNew) {
      payload.createdAt = serverTimestamp();
    }

    await setDoc(docRef, payload, { merge: true });
    return { error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { error: error.message || "Failed to submit investor profile." };
  }
}

/**
 * Public: Fetch all published investor profiles (status == 'published')
 * Returns both published Firestore investor profiles and demo investors,
 * deduplicating to avoid any conflicts.
 */
export async function getPublishedInvestors(): Promise<{
  investors: InvestorProfile[];
  error: string | null;
}> {
  try {
    const profilesRef = collection(db, "investorProfiles");
    let snap;

    try {
      const q = query(
        profilesRef,
        where("status", "==", "published"),
        orderBy("updatedAt", "desc")
      );
      snap = await getDocs(q);
    } catch {
      const q = query(profilesRef, where("status", "==", "published"));
      snap = await getDocs(q);
    }

    const realInvestors: InvestorProfile[] = [];
    snap.forEach((d) => {
      const normalized = normalizeInvestorProfile(d.id, d.data());
      if (normalized.status === "published") {
        realInvestors.push({ ...normalized, isDemo: false });
      }
    });

    // Merge with demo investors, deduplicating so real Firestore records take precedence
    const realIds = new Set(realInvestors.map((i) => i.id));
    const dedupedDemo = DEMO_INVESTORS.filter((d) => !realIds.has(d.id));
    const combined = [...realInvestors, ...dedupedDemo];

    return { investors: combined, error: null };
  } catch {
    // If Firestore is empty, unconfigured, or offline, gracefully return demo investors
    return { investors: DEMO_INVESTORS, error: null };
  }
}

/**
 * Public: Fetch single published investor profile by ID
 * Checks demo investors first, then Firestore published profiles.
 */
export async function getPublishedInvestorById(
  id: string
): Promise<{ investor: InvestorProfile | null; error: string | null }> {
  try {
    // 1. Check demo investors
    const demo = DEMO_INVESTORS.find((d) => d.id === id);
    if (demo) {
      return { investor: demo, error: null };
    }

    // 2. Fetch from Firestore
    const docRef = doc(db, "investorProfiles", id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return { investor: null, error: "Investor profile not found." };
    }

    const investor = normalizeInvestorProfile(snap.id, snap.data());
    if (investor.status !== "published") {
      // Allow owner or admin to preview unpublished
      const user = auth.currentUser;
      if (!user || user.uid !== investor.userId) {
        return { investor: null, error: "This investor profile is currently undergoing verification." };
      }
    }

    return { investor: { ...investor, isDemo: false }, error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { investor: null, error: error.message || "Failed to load investor profile." };
  }
}

/**
 * Admin: Fetch all investor profiles with optional status filter
 */
export async function getAllInvestorsAdmin(
  statusFilter?: InvestorStatus | "all"
): Promise<{ investors: InvestorProfile[]; error: string | null }> {
  try {
    const profilesRef = collection(db, "investorProfiles");
    const snap = await getDocs(profilesRef);

    const list: InvestorProfile[] = [];
    snap.forEach((d) => {
      list.push(normalizeInvestorProfile(d.id, d.data()));
    });

    list.sort((a, b) => {
      const timeA = (a.updatedAt as { seconds?: number })?.seconds || 0;
      const timeB = (b.updatedAt as { seconds?: number })?.seconds || 0;
      return timeB - timeA;
    });

    if (statusFilter && statusFilter !== "all") {
      return {
        investors: list.filter((i) => i.status === statusFilter),
        error: null,
      };
    }

    return { investors: list, error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { investors: [], error: error.message || "Failed to load investor profiles." };
  }
}

/**
 * Admin: Approve investor profile (sets status = 'published')
 */
export async function approveInvestor(
  uid: string
): Promise<{ error: string | null }> {
  try {
    const docRef = doc(db, "investorProfiles", uid);
    await updateDoc(docRef, {
      status: "published",
      publishedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      rejectionReason: null,
    });
    return { error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { error: error.message || "Failed to approve investor profile." };
  }
}

/**
 * Admin: Reject investor profile with mandatory reason
 */
export async function rejectInvestor(
  uid: string,
  rejectionReason: string
): Promise<{ error: string | null }> {
  try {
    if (!rejectionReason.trim()) {
      return { error: "A rejection reason is required." };
    }
    const docRef = doc(db, "investorProfiles", uid);
    await updateDoc(docRef, {
      status: "rejected",
      rejectionReason: rejectionReason.trim(),
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { error: error.message || "Failed to reject investor profile." };
  }
}

/**
 * Admin: Edit investor profile directly
 */
export async function updateInvestorAdmin(
  uid: string,
  updates: Partial<InvestorProfile>
): Promise<{ error: string | null }> {
  try {
    const docRef = doc(db, "investorProfiles", uid);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { error: error.message || "Failed to update investor profile." };
  }
}

/**
 * Admin: Permanently delete investor profile
 */
export async function deleteInvestor(
  uid: string
): Promise<{ error: string | null }> {
  try {
    const docRef = doc(db, "investorProfiles", uid);
    await deleteDoc(docRef);
    return { error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { error: error.message || "Failed to delete investor profile." };
  }
}

/**
 * Public/Entrepreneur: Express Interest in an investor
 */
export async function submitInvestorEnquiry(
  data: InvestorEnquiry
): Promise<{ id: string | null; error: string | null }> {
  try {
    const docRef = await addDoc(collection(db, "investor_enquiries"), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { id: null, error: error.message || "Failed to submit expression of interest." };
  }
}
