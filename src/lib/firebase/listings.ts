import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "./client";
import { Opportunity, InvestmentRangeCategory, OpportunityCategory } from "@/lib/constants/opportunities";

export type ListingStatus = "pending" | "published" | "rejected";

export type ListingType =
  | "Investment"
  | "Business"
  | "Franchise"
  | "Dealership"
  | "Partnership"
  | "International"
  | "EXIM";

export function convertListingToOpportunity(item: BusinessListing): Opportunity {
  let rangeCategory: InvestmentRangeCategory = "25l-50l";
  let targetAmountNum = 3500000;
  const rangeStr = (item.investmentRange || "").toLowerCase();

  if (rangeStr.includes("1l") && (rangeStr.includes("5l") || !rangeStr.includes("–"))) {
    rangeCategory = "1l-5l";
    targetAmountNum = 300000;
  } else if (rangeStr.includes("5l") && rangeStr.includes("10l")) {
    rangeCategory = "5l-10l";
    targetAmountNum = 750000;
  } else if (rangeStr.includes("10l") && rangeStr.includes("25l")) {
    rangeCategory = "10l-25l";
    targetAmountNum = 1500000;
  } else if (rangeStr.includes("25l") && rangeStr.includes("50l")) {
    rangeCategory = "25l-50l";
    targetAmountNum = 3500000;
  } else if (rangeStr.includes("50l") && (rangeStr.includes("1cr") || rangeStr.includes("1 cr"))) {
    rangeCategory = "50l-1cr";
    targetAmountNum = 7500000;
  } else if (rangeStr.includes("1cr") || rangeStr.includes("1 cr")) {
    rangeCategory = "1cr-plus";
    targetAmountNum = 15000000;
  }

  // Normalize category to valid OpportunityCategory
  const rawType = (item.listingType || item.category || "").toLowerCase();
  let category: OpportunityCategory = "Business";
  if (rawType.includes("franchise")) category = "Franchise";
  else if (rawType.includes("invest")) category = "Investment";
  else if (rawType.includes("dealership")) category = "Dealership";
  else if (rawType.includes("partner")) category = "Partnership";
  else if (rawType.includes("internat")) category = "International";
  else if (rawType.includes("exim")) category = "EXIM";
  else category = "Business";

  // Validate images gracefully
  const hasValidImage =
    Array.isArray(item.images) &&
    item.images.length > 0 &&
    typeof item.images[0] === "string" &&
    item.images[0].trim().length > 0 &&
    item.images[0] !== "/images/opp-default.jpg";

  const defaultImage =
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80";

  const imageUrl = hasValidImage ? item.images[0].trim() : defaultImage;

  const docId = item.id || `listing-${Date.now()}`;

  const detailsList: string[] = [];
  if (item.category) detailsList.push(`Category: ${item.category}`);
  if (item.sector) detailsList.push(`Sector: ${item.sector}`);
  if (item.location) detailsList.push(`Location: ${item.location}`);
  if (item.investmentRange) detailsList.push(`Investment Range: ${item.investmentRange}`);
  if (item.ownerName) detailsList.push(`Contact Person: ${item.ownerName}`);
  if (item.contactPhone) detailsList.push(`Contact Phone: ${item.contactPhone}`);
  if (item.contactEmail) detailsList.push(`Contact Email: ${item.contactEmail}`);

  const keyInfo: { label: string; value: string }[] = [];
  if (item.listingType) keyInfo.push({ label: "Listing Type", value: item.listingType });
  if (item.category) keyInfo.push({ label: "Category", value: item.category });
  if (item.sector) keyInfo.push({ label: "Sector", value: item.sector });
  if (item.location) keyInfo.push({ label: "Location", value: item.location });
  if (item.investmentRange) keyInfo.push({ label: "Investment Range", value: item.investmentRange });
  if (item.ownerName) keyInfo.push({ label: "Contact Person", value: item.ownerName });
  if (item.contactPhone) keyInfo.push({ label: "Contact Phone", value: item.contactPhone });
  if (item.contactEmail) keyInfo.push({ label: "Contact Email", value: item.contactEmail });

  return {
    id: docId,
    slug: docId,
    title: item.title || "Untitled Opportunity",
    category,
    sector: item.sector || "General",
    location: item.location || "India",
    investmentRange: item.investmentRange || "₹25L – ₹50L",
    rangeCategory,
    targetRaise: item.investmentRange || "Undisclosed",
    targetAmountNum,
    type: item.category || item.listingType || "Business Opportunity",
    stageBadge: "Verified Business",
    isFeatured: false,
    topOpportunity: false,
    isDemo: false,
    shortDescription:
      item.shortDescription ||
      (typeof item.description === "string" ? item.description.slice(0, 160) : "") ||
      "Verified commercial opportunity on Wenturex.",
    overview: item.shortDescription || item.description || "",
    businessDescription: item.description || item.shortDescription || "",
    opportunityDetails: detailsList,
    keyInformation: keyInfo,
    imageUrl,
    ownerId: item.ownerId || "",
    ownerName: item.ownerName || "",
    ownerEmail: item.ownerEmail || "",
    contactPhone: item.contactPhone || "",
    contactEmail: item.contactEmail || "",
    whatsappNumber: item.contactPhone || "",
  };
}

export interface BusinessListing {
  id?: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  title: string;
  listingType: ListingType;
  category: string;
  sector: string;
  location: string;
  investmentRange: string;
  shortDescription: string;
  description: string;
  contactPhone: string;
  contactEmail: string;
  images: string[];
  status: ListingStatus;
  createdAt: unknown;
  updatedAt: unknown;
  publishedAt?: unknown;
  rejectionReason?: string;
}

export type CreateListingInput = Omit<
  BusinessListing,
  "id" | "ownerId" | "ownerName" | "ownerEmail" | "status" | "createdAt" | "updatedAt" | "publishedAt" | "rejectionReason"
>;

/**
 * Create a new business listing (always starts as pending)
 */
export async function createListing(
  input: CreateListingInput
): Promise<{ id: string | null; error: string | null }> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn("[createListing] No authenticated Firebase user found.");
      return { id: null, error: "You must be signed in as an entrepreneur to submit a listing." };
    }

    const listingData = {
      ownerId: currentUser.uid,
      ownerEmail: currentUser.email || input.contactEmail || "",
      ownerName: currentUser.displayName || input.contactEmail.split("@")[0] || "Entrepreneur",
      title: input.title,
      listingType: input.listingType,
      category: input.category,
      sector: input.sector,
      location: input.location,
      investmentRange: input.investmentRange,
      shortDescription: input.shortDescription,
      description: input.description,
      contactPhone: input.contactPhone,
      contactEmail: input.contactEmail,
      images: input.images || [],
      status: "pending" as const, // Strictly forced to pending
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Safe debugging log requested by user
    console.log({
      authenticatedUid: currentUser?.uid,
      ownerId: listingData.ownerId,
      status: listingData.status,
    });

    const docRef = await addDoc(collection(db, "listings"), listingData);
    console.log("[createListing] Document written successfully to listings/" + docRef.id);
    return { id: docRef.id, error: null };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    console.error("[createListing] Firebase error code:", error.code, "message:", error.message);
    return { id: null, error: error.message || "Failed to submit business listing." };
  }
}

/**
 * Normalize any raw Firestore listing document (modern, legacy, or imported)
 * to ensure all expected fields and statuses exist consistently.
 */
export function normalizeListing(docId: string, rawData: Record<string, unknown>): BusinessListing {
  // 1. Status normalization
  const rawStatus = (
    rawData.status ||
    rawData.approvalStatus ||
    rawData.listingStatus ||
    rawData.state ||
    "pending"
  )
    .toString()
    .toLowerCase()
    .trim();

  let status: ListingStatus = "pending";
  if (
    rawStatus === "published" ||
    rawStatus === "approved" ||
    rawStatus === "live" ||
    rawStatus === "active"
  ) {
    status = "published";
  } else if (
    rawStatus === "rejected" ||
    rawStatus === "declined" ||
    rawStatus === "disapproved"
  ) {
    status = "rejected";
  } else {
    // Older or unapproved listings default to "pending" review
    status = "pending";
  }

  // 2. Owner normalization (supports ownerId, userId, createdBy, authorId)
  const ownerId = (
    rawData.ownerId ||
    rawData.userId ||
    rawData.createdBy ||
    rawData.authorId ||
    rawData.uid ||
    "unknown"
  ) as string;

  const ownerName = (
    rawData.ownerName ||
    rawData.userName ||
    rawData.fullName ||
    rawData.contactPerson ||
    rawData.contactName ||
    rawData.name ||
    "Entrepreneur"
  ) as string;

  const ownerEmail = (
    rawData.ownerEmail ||
    rawData.userEmail ||
    rawData.contactEmail ||
    rawData.email ||
    ""
  ) as string;

  // 3. Title & Content normalization
  const title = (
    rawData.title ||
    rawData.listingTitle ||
    rawData.businessName ||
    rawData.opportunityTitle ||
    rawData.companyName ||
    rawData.name ||
    "Untitled Opportunity"
  ) as string;

  const listingType = (
    rawData.listingType ||
    rawData.opportunityType ||
    rawData.type ||
    rawData.category ||
    "Business"
  ) as ListingType;

  const category = (
    rawData.category ||
    rawData.listingCategory ||
    rawData.industry ||
    rawData.sector ||
    "General"
  ) as string;

  const sector = (
    rawData.sector ||
    rawData.industrySector ||
    rawData.domain ||
    category ||
    "General"
  ) as string;

  const location = (
    rawData.location ||
    rawData.city ||
    rawData.address ||
    "India"
  ) as string;

  const investmentRange = (
    rawData.investmentRange ||
    rawData.investment ||
    rawData.budget ||
    rawData.targetRaise ||
    rawData.askAmount ||
    "₹25L – ₹50L"
  ) as string;

  const shortDescription = (
    rawData.shortDescription ||
    rawData.summary ||
    rawData.overview ||
    (typeof rawData.description === "string" ? rawData.description.slice(0, 160) : "") ||
    "No summary provided."
  ) as string;

  const description = (
    rawData.description ||
    rawData.detailedDescription ||
    rawData.details ||
    shortDescription
  ) as string;

  const contactPhone = (
    rawData.contactPhone ||
    rawData.phone ||
    rawData.phoneNumber ||
    rawData.mobile ||
    ""
  ) as string;

  const contactEmail = (
    rawData.contactEmail ||
    ownerEmail ||
    ""
  ) as string;

  const images = Array.isArray(rawData.images) && rawData.images.length > 0
    ? (rawData.images as string[])
    : typeof rawData.imageUrl === "string" && rawData.imageUrl.trim()
    ? [rawData.imageUrl.trim()]
    : ["/images/opp-default.jpg"];

  // 4. Timestamps
  const createdAt =
    rawData.createdAt ||
    rawData.createdDate ||
    rawData.timestamp ||
    rawData.updatedAt ||
    null;

  const updatedAt =
    rawData.updatedAt ||
    rawData.updatedDate ||
    createdAt ||
    null;

  return {
    id: docId,
    ownerId,
    ownerName,
    ownerEmail,
    title,
    listingType,
    category,
    sector,
    location,
    investmentRange,
    shortDescription,
    description,
    contactPhone,
    contactEmail,
    images,
    status,
    createdAt,
    updatedAt,
    publishedAt: rawData.publishedAt || (status === "published" ? updatedAt : null),
    rejectionReason: (rawData.rejectionReason as string) || undefined,
  };
}

/**
 * Fetch all listings owned by the currently authenticated user
 */
export async function getUserListings(): Promise<{ listings: BusinessListing[]; error: string | null }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { listings: [], error: "Not authenticated" };
    }

    const listingsRef = collection(db, "listings");
    const listings: BusinessListing[] = [];
    const seenIds = new Set<string>();

    try {
      const q = query(
        listingsRef,
        where("ownerId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((docSnap) => {
        seenIds.add(docSnap.id);
        listings.push(normalizeListing(docSnap.id, docSnap.data()));
      });
    } catch {
      // Fallback query without composite ordering
      const q = query(listingsRef, where("ownerId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((docSnap) => {
        seenIds.add(docSnap.id);
        listings.push(normalizeListing(docSnap.id, docSnap.data()));
      });
    }

    // Also check for legacy userId field if no listings found
    if (listings.length === 0) {
      try {
        const qLegacy = query(listingsRef, where("userId", "==", user.uid));
        const legacySnap = await getDocs(qLegacy);
        legacySnap.forEach((docSnap) => {
          if (!seenIds.has(docSnap.id)) {
            seenIds.add(docSnap.id);
            listings.push(normalizeListing(docSnap.id, docSnap.data()));
          }
        });
      } catch {
        // Safe ignore
      }
    }

    // Client-side sort fallback
    listings.sort((a, b) => {
      const timeA = (a.createdAt as { seconds?: number })?.seconds || 0;
      const timeB = (b.createdAt as { seconds?: number })?.seconds || 0;
      return timeB - timeA;
    });

    return { listings, error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { listings: [], error: error.message || "Failed to fetch user listings." };
  }
}

/**
 * Fetch public published listings (strictly where status == 'published')
 */
export async function getPublishedListings(): Promise<{ listings: BusinessListing[]; error: string | null }> {
  try {
    const listingsRef = collection(db, "listings");
    let querySnapshot;

    try {
      const q = query(
        listingsRef,
        where("status", "==", "published"),
        orderBy("createdAt", "desc")
      );
      querySnapshot = await getDocs(q);
    } catch {
      // Fallback query without composite index requirement
      const q = query(listingsRef, where("status", "==", "published"));
      querySnapshot = await getDocs(q);
    }

    const listings: BusinessListing[] = [];
    querySnapshot.forEach((docSnap) => {
      const normalized = normalizeListing(docSnap.id, docSnap.data());
      if (normalized.status === "published") {
        listings.push(normalized);
      }
    });

    // In-memory sort by createdAt descending (newest first)
    listings.sort((a, b) => {
      const timeA = (a.createdAt as { seconds?: number })?.seconds || 0;
      const timeB = (b.createdAt as { seconds?: number })?.seconds || 0;
      return timeB - timeA;
    });

    return { listings, error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    console.error("[getPublishedListings] Error:", error);
    return { listings: [], error: error.message || "Failed to fetch published listings." };
  }
}

/**
 * Fetch a single published listing by ID
 */
export async function getPublishedListingById(
  listingId: string
): Promise<{ listing: BusinessListing | null; error: string | null }> {
  try {
    const docRef = doc(db, "listings", listingId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { listing: null, error: "Listing not found" };
    }

    const normalized = normalizeListing(docSnap.id, docSnap.data());
    if (normalized.status !== "published") {
      // Only owner or admin can view unpublished
      const user = auth.currentUser;
      if (!user || user.uid !== normalized.ownerId) {
        return { listing: null, error: "Listing is not publicly available." };
      }
    }

    return {
      listing: normalized,
      error: null,
    };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { listing: null, error: error.message || "Failed to load listing." };
  }
}

/**
 * Admin: Fetch all listings across all users with safe schema normalization.
 * Does NOT filter out listings missing a strict 'pending' field.
 */
export async function getAllListings(
  statusFilter?: ListingStatus | "all"
): Promise<{ listings: BusinessListing[]; error: string | null }> {
  try {
    const listings: BusinessListing[] = [];
    const seenIds = new Set<string>();

    // 1. Primary collection: "listings"
    const listingsRef = collection(db, "listings");
    let querySnapshot;

    try {
      const q = query(listingsRef, orderBy("createdAt", "desc"));
      querySnapshot = await getDocs(q);
    } catch {
      querySnapshot = await getDocs(listingsRef);
    }

    querySnapshot.forEach((docSnap) => {
      seenIds.add(docSnap.id);
      listings.push(normalizeListing(docSnap.id, docSnap.data()));
    });

    // 2. Fallback collections check (in case older opportunities were stored in other collections)
    const fallbackCollections = ["opportunities", "business_listings"];
    for (const colName of fallbackCollections) {
      try {
        const fallbackRef = collection(db, colName);
        const snap = await getDocs(fallbackRef);
        snap.forEach((docSnap) => {
          if (!seenIds.has(docSnap.id)) {
            const data = docSnap.data();
            if (data.title || data.listingTitle || data.businessName || data.name) {
              seenIds.add(docSnap.id);
              listings.push(normalizeListing(docSnap.id, data));
            }
          }
        });
      } catch {
        // Fallback collection does not exist or not readable - safely ignore
      }
    }

    // Sort by createdAt descending
    listings.sort((a, b) => {
      const timeA = (a.createdAt as { seconds?: number })?.seconds || 0;
      const timeB = (b.createdAt as { seconds?: number })?.seconds || 0;
      return timeB - timeA;
    });

    // Apply normalized status filter
    if (statusFilter && statusFilter !== "all") {
      const filtered = listings.filter((item) => item.status === statusFilter);
      return { listings: filtered, error: null };
    }

    return { listings, error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { listings: [], error: error.message || "Failed to fetch all listings." };
  }
}

/**
 * Admin: Approve listing
 * Updates the existing document in-place, without creating duplicates.
 */
export async function approveListing(listingId: string): Promise<{ error: string | null }> {
  try {
    const docRef = doc(db, "listings", listingId);
    try {
      await updateDoc(docRef, {
        status: "published",
        approvalStatus: "approved",
        publishedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        rejectionReason: null,
      });
      return { error: null };
    } catch (e: unknown) {
      const err = e as { code?: string };
      // If not in "listings", try "opportunities" collection fallback
      if (err.code === "not-found") {
        const oppRef = doc(db, "opportunities", listingId);
        await updateDoc(oppRef, {
          status: "published",
          approvalStatus: "approved",
          publishedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          rejectionReason: null,
        });
        return { error: null };
      }
      throw e;
    }
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { error: error.message || "Failed to approve listing." };
  }
}

/**
 * Admin: Reject listing with mandatory reason
 * Updates the existing document in-place, preserving data without deletion.
 */
export async function rejectListing(
  listingId: string,
  rejectionReason: string
): Promise<{ error: string | null }> {
  try {
    if (!rejectionReason.trim()) {
      return { error: "A rejection reason is required." };
    }
    const docRef = doc(db, "listings", listingId);
    try {
      await updateDoc(docRef, {
        status: "rejected",
        approvalStatus: "rejected",
        rejectionReason: rejectionReason.trim(),
        updatedAt: serverTimestamp(),
      });
      return { error: null };
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err.code === "not-found") {
        const oppRef = doc(db, "opportunities", listingId);
        await updateDoc(oppRef, {
          status: "rejected",
          approvalStatus: "rejected",
          rejectionReason: rejectionReason.trim(),
          updatedAt: serverTimestamp(),
        });
        return { error: null };
      }
      throw e;
    }
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { error: error.message || "Failed to reject listing." };
  }
}

/**
 * Delete listing (Admin or Owner)
 */
export async function deleteListing(listingId: string): Promise<{ error: string | null }> {
  try {
    const docRef = doc(db, "listings", listingId);
    await deleteDoc(docRef);
    return { error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { error: error.message || "Failed to delete listing." };
  }
}

/**
 * Upload a listing image to Firebase Storage
 */
export async function uploadListingImage(
  file: File,
  tempId: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { url: null, error: "Authentication required to upload image." };
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storageRef = ref(storage, `listings/${tempId}/${timestamp}_${safeName}`);

    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);

    return { url: downloadUrl, error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { url: null, error: error.message || "Failed to upload image." };
  }
}
