import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { auth, storage } from "./client";

export interface StorageUploadResult {
  url: string | null;
  fileName: string | null;
  storagePath: string | null;
  error: string | null;
  errorCode?: string | null;
}

export interface ImageUploadResult {
  url: string | null;
  storagePath: string | null;
  error: string | null;
  errorCode?: string | null;
}

/**
 * Maps Firebase Storage technical error codes and exception messages to
 * clear, actionable, user-friendly messages.
 */
export function formatStorageError(err: unknown): { message: string; code: string } {
  if (!err) {
    return {
      message: "An unknown upload error occurred. Please try again.",
      code: "storage/unknown",
    };
  }

  const error = err as { code?: string; message?: string; name?: string };
  const rawCode = (error.code || "").toLowerCase();
  const rawMessage = (error.message || "").toLowerCase();

  if (rawCode.includes("unauthorized") || rawMessage.includes("unauthorized")) {
    return {
      message: "Upload permission denied. Please ensure you are logged in, or continue without this file.",
      code: "storage/unauthorized",
    };
  }

  if (rawCode.includes("unauthenticated") || rawMessage.includes("unauthenticated")) {
    return {
      message: "Your session has expired. Please sign in again to upload files.",
      code: "storage/unauthenticated",
    };
  }

  if (rawCode.includes("quota-exceeded") || rawMessage.includes("quota")) {
    return {
      message: "Upload limit temporarily reached. Please try again later or continue without this file.",
      code: "storage/quota-exceeded",
    };
  }

  if (
    rawCode.includes("bucket-not-found") ||
    rawCode.includes("project-not-found") ||
    rawMessage.includes("bucket") ||
    rawMessage.includes("storage/project-not-found")
  ) {
    return {
      message: "File upload storage is currently unavailable. You can continue submitting the form without the file.",
      code: "storage/bucket-not-found",
    };
  }

  if (rawCode.includes("canceled") || rawMessage.includes("canceled") || rawMessage.includes("cancelled")) {
    return {
      message: "File upload was canceled. You can retry or choose another file.",
      code: "storage/canceled",
    };
  }

  if (rawCode.includes("retry-limit-exceeded") || rawMessage.includes("timeout") || rawMessage.includes("network")) {
    return {
      message: "Upload timed out due to network issues. Please check your internet connection and retry.",
      code: "storage/retry-limit-exceeded",
    };
  }

  if (rawCode.includes("invalid-checksum") || rawCode.includes("invalid-format")) {
    return {
      message: "The selected file appears to be corrupted. Please select a valid file from your device.",
      code: "storage/invalid-checksum",
    };
  }

  if (rawMessage.includes("cors") || rawMessage.includes("failed to fetch")) {
    return {
      message: "File upload service is currently unavailable. Please try again later or continue without the file.",
      code: "storage/network-error",
    };
  }

  // Fallback user-friendly generic message
  return {
    message: "File upload is currently unavailable. Please try again later or continue without the file.",
    code: rawCode || "storage/unknown",
  };
}

/**
 * Validates a PDF pitch deck file before upload attempt.
 */
export function validatePitchDeckFile(file: File): string | null {
  if (!file) {
    return "Please select a file to upload.";
  }

  const isPdf =
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    return "Pitch deck must be a PDF document (.pdf).";
  }

  const maxSizeBytes = 20 * 1024 * 1024; // 20 MB
  if (file.size > maxSizeBytes) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return `Pitch deck file size must be less than 20MB (selected file is ${sizeMb}MB).`;
  }

  if (file.size === 0) {
    return "The selected PDF file is empty. Please choose a valid document.";
  }

  return null;
}

/**
 * Validates an image file (cover photo, avatar) before upload attempt.
 */
export function validateImageFile(file: File, maxMb = 5): string | null {
  if (!file) {
    return "Please select an image file.";
  }

  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ];

  const validExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];
  const lowerName = file.name.toLowerCase();
  const hasValidExt = validExtensions.some((ext) => lowerName.endsWith(ext));
  const hasValidType = validTypes.includes(file.type);

  if (!hasValidType && !hasValidExt) {
    return "Please select a valid image file (JPG, PNG, or WebP).";
  }

  const maxSizeBytes = maxMb * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return `Image file size must be less than ${maxMb}MB (selected file is ${sizeMb}MB).`;
  }

  if (file.size === 0) {
    return "The selected image file is empty. Please choose a valid image.";
  }

  return null;
}

/**
 * Sanitizes a file name for safe storage path creation.
 */
function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 100);
}

/**
 * Upload a PDF Pitch Deck to Firebase Storage with full error handling.
 */
export async function uploadPitchDeckFile(
  file: File,
  folderId: string
): Promise<StorageUploadResult> {
  // 1. Client-side pre-validation
  const validationError = validatePitchDeckFile(file);
  if (validationError) {
    return {
      url: null,
      fileName: null,
      storagePath: null,
      error: validationError,
      errorCode: "validation/invalid-file",
    };
  }

  // 2. Authentication check
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return {
      url: null,
      fileName: null,
      storagePath: null,
      error: "You must be signed in to upload a pitch deck.",
      errorCode: "storage/unauthenticated",
    };
  }

  try {
    const timestamp = Date.now();
    const safeName = sanitizeFileName(file.name);
    const storagePath = `pitchDecks/${folderId}/${timestamp}_${safeName}`;
    const storageRef = ref(storage, storagePath);

    // Upload with explicit content type metadata
    await uploadBytes(storageRef, file, {
      contentType: "application/pdf",
      customMetadata: {
        originalName: file.name,
        uploadedBy: currentUser.uid,
        uploadedAt: new Date().toISOString(),
      },
    });

    const downloadUrl = await getDownloadURL(storageRef);

    return {
      url: downloadUrl,
      fileName: file.name,
      storagePath,
      error: null,
    };
  } catch (err: unknown) {
    console.error("[uploadPitchDeckFile] Firebase Storage error:", err);
    const formatted = formatStorageError(err);
    return {
      url: null,
      fileName: null,
      storagePath: null,
      error: formatted.message,
      errorCode: formatted.code,
    };
  }
}

/**
 * Upload a business listing cover image to Firebase Storage with full error handling.
 */
export async function uploadListingImageFile(
  file: File,
  folderId: string
): Promise<ImageUploadResult> {
  // 1. Pre-validation
  const validationError = validateImageFile(file, 5);
  if (validationError) {
    return {
      url: null,
      storagePath: null,
      error: validationError,
      errorCode: "validation/invalid-file",
    };
  }

  // 2. Authentication check
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return {
      url: null,
      storagePath: null,
      error: "You must be signed in to upload an image.",
      errorCode: "storage/unauthenticated",
    };
  }

  try {
    const timestamp = Date.now();
    const safeName = sanitizeFileName(file.name);
    const storagePath = `listings/${folderId}/${timestamp}_${safeName}`;
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, file, {
      contentType: file.type || "image/jpeg",
      customMetadata: {
        originalName: file.name,
        uploadedBy: currentUser.uid,
      },
    });

    const downloadUrl = await getDownloadURL(storageRef);

    return {
      url: downloadUrl,
      storagePath,
      error: null,
    };
  } catch (err: unknown) {
    console.error("[uploadListingImageFile] Firebase Storage error:", err);
    const formatted = formatStorageError(err);
    return {
      url: null,
      storagePath: null,
      error: formatted.message,
      errorCode: formatted.code,
    };
  }
}

/**
 * Upload an investor profile avatar image to Firebase Storage with full error handling.
 */
export async function uploadInvestorAvatarFile(
  file: File,
  userId: string
): Promise<ImageUploadResult> {
  // 1. Pre-validation
  const validationError = validateImageFile(file, 5);
  if (validationError) {
    return {
      url: null,
      storagePath: null,
      error: validationError,
      errorCode: "validation/invalid-file",
    };
  }

  // 2. Authentication check
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return {
      url: null,
      storagePath: null,
      error: "You must be signed in to upload a profile picture.",
      errorCode: "storage/unauthenticated",
    };
  }

  try {
    const timestamp = Date.now();
    const safeName = sanitizeFileName(file.name);
    const storagePath = `investorProfiles/${userId}/${timestamp}_${safeName}`;
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, file, {
      contentType: file.type || "image/jpeg",
      customMetadata: {
        originalName: file.name,
        uploadedBy: currentUser.uid,
      },
    });

    const downloadUrl = await getDownloadURL(storageRef);

    return {
      url: downloadUrl,
      storagePath,
      error: null,
    };
  } catch (err: unknown) {
    console.error("[uploadInvestorAvatarFile] Firebase Storage error:", err);
    const formatted = formatStorageError(err);
    return {
      url: null,
      storagePath: null,
      error: formatted.message,
      errorCode: formatted.code,
    };
  }
}

/**
 * Safely delete a file from Firebase Storage if needed (clean up temporary or replaced files).
 */
export async function deleteStorageFile(storagePath: string): Promise<{ success: boolean; error: string | null }> {
  if (!storagePath) {
    return { success: true, error: null };
  }

  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    return { success: true, error: null };
  } catch (err: unknown) {
    // If file doesn't exist or already removed, treat as success
    const error = err as { code?: string };
    if (error.code === "storage/object-not-found") {
      return { success: true, error: null };
    }
    return { success: false, error: "Failed to delete old file." };
  }
}
