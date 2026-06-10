"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(10).max(3000),
  company: z.string().max(0),
});

function sanitizeInput(value: string) {
  return value.replace(/[<>]/g, "").trim();
}

export async function submitContactForm(formData: FormData) {
  const payload = {
    name: sanitizeInput(String(formData.get("name") ?? "")),
    email: sanitizeInput(String(formData.get("email") ?? "")),
    message: sanitizeInput(String(formData.get("message") ?? "")),
    company: String(formData.get("company") ?? ""),
  };

  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    redirect("/contact?status=invalid");
  }

  // Placeholder architecture: this is where a secure email/API integration would be added.
  // Keep all secret-bearing integrations server-side only.
  console.info("Contact submission received", {
    name: parsed.data.name,
    email: parsed.data.email,
    messageLength: parsed.data.message.length,
  });

  redirect("/contact?status=success");
}
