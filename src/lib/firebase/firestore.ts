import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./client";

export interface ContactSubmission {
  fullName: string;
  email: string;
  phone: string;
  userRole: string;
  subject: string;
  message: string;
}

export interface OpportunityEnquiry {
  opportunityId: string;
  opportunityTitle: string;
  name: string;
  email: string;
  phone: string;
  investmentCapacity?: string;
  message: string;
}

/**
 * Submit general contact inquiry
 */
export async function submitContactMessage(data: ContactSubmission) {
  try {
    const docRef = await addDoc(collection(db, "contact_inquiries"), {
      ...data,
      createdAt: serverTimestamp(),
      status: "new",
    });
    return { id: docRef.id, error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { id: null, error: error.message || "Failed to submit message" };
  }
}

/**
 * Submit deal/opportunity specific enquiry
 */
export async function submitOpportunityEnquiry(data: OpportunityEnquiry) {
  try {
    const docRef = await addDoc(collection(db, "opportunity_enquiries"), {
      ...data,
      createdAt: serverTimestamp(),
      status: "new",
    });
    return { id: docRef.id, error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { id: null, error: error.message || "Failed to submit enquiry" };
  }
}
