import { z } from "zod";

export const PROJECT_TYPES = [
  "Web Development",
  "App Development",
  "Photography",
  "Videography",
  "Something Else",
] as const;

export const BUDGET_RANGES = [
  "Exploring / Not Sure Yet",
  "Under ₹50K",
  "₹50K – ₹1L",
  "₹1L – ₹3L",
  "₹3L – ₹10L",
  "₹10L+",
] as const;

export const ESTIMATED_TIMELINES = [
  "Under 1 Month",
  "1 – 3 Months",
  "3 – 6 Months",
  "6+ Months",
] as const;

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(80, "That name looks a little too long."),
  email: z
    .string()
    .trim()
    .min(1, "We'll need an email to reply to.")
    .email("Enter a valid email address."),
  company: z
    .string()
    .trim()
    .max(100, "That company name looks a little too long.")
    .optional()
    .or(z.literal("")),
  projectType: z.enum(PROJECT_TYPES, {
    errorMap: () => ({ message: "Let us know what you're building." }),
  }),
  timeline: z.enum(ESTIMATED_TIMELINES, {
    errorMap: () => ({ message: "Please select an estimated timeline." }),
  }),
  budget: z.enum(BUDGET_RANGES).optional(),
  message: z
    .string()
    .trim()
    .min(20, "Give us a little more to go on — a couple of sentences is perfect.")
    .max(2000, "That's a lot to say — try trimming it down a bit."),
  // Honeypot — real visitors never see or fill this field
  company_website: z.union([z.literal(""), z.undefined()]),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export type ContactFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };
