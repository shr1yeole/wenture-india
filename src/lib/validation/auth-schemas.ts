import { z } from "zod";

export const investorLoginSchema = z.object({
  email: z.string().email("Please enter a valid corporate email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export type InvestorLoginInput = z.infer<typeof investorLoginSchema>;

export const investorSignupSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid work email"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  location: z.string().min(2, "Primary location is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
  terms: z.boolean().refine((val) => val === true, "You must agree to the Terms and Privacy Policy"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type InvestorSignupInput = z.infer<typeof investorSignupSchema>;

export const entrepreneurLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export type EntrepreneurLoginInput = z.infer<typeof entrepreneurLoginSchema>;

export const entrepreneurSignupSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  companyName: z.string().min(2, "Company / business name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  location: z.string().min(2, "Location is required"),
  sector: z.string().min(1, "Please select your primary sector"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
  terms: z.boolean().refine((val) => val === true, "You must agree to the Terms and Privacy Policy"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type EntrepreneurSignupInput = z.infer<typeof entrepreneurSignupSchema>;

export const contactFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8, "Phone number is required"),
  userRole: z.enum(["investor", "entrepreneur", "business_owner", "franchise_seeker", "other"]),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

export const enquiryModalSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(8, "Phone number is required"),
  investmentCapacity: z.string().optional(),
  message: z.string().min(5, "Brief note is required"),
});

export type EnquiryModalInput = z.infer<typeof enquiryModalSchema>;
