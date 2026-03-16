"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { platformSettings } from "@/lib/schema";

const KEYS = {
  platformName: "platform_name",
  logoUrl: "logo_url",
  evcPhone: "evc_phone",
  dahabshiilPhone: "dahabshiil_phone",
} as const;

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await db.select().from(platformSettings);
  return Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""]));
}

export async function updateSettings(_prev: unknown, formData: FormData) {
  const platformName = formData.get("platformName")?.toString()?.trim() ?? "";
  const logoUrl = formData.get("logoUrl")?.toString()?.trim() ?? "";
  const evcPhone = formData.get("evcPhone")?.toString()?.trim() ?? "";
  const dahabshiilPhone = formData.get("dahabshiilPhone")?.toString()?.trim() ?? "";

  const entries: [string, string][] = [
    [KEYS.platformName, platformName],
    [KEYS.logoUrl, logoUrl],
    [KEYS.evcPhone, evcPhone],
    [KEYS.dahabshiilPhone, dahabshiilPhone],
  ];
  for (const [key, value] of entries) {
    const existing = await db.select().from(platformSettings).where(eq(platformSettings.key, key)).limit(1);
    if (existing.length) {
      await db.update(platformSettings).set({ value, updatedAt: new Date() }).where(eq(platformSettings.key, key));
    } else {
      await db.insert(platformSettings).values({ key, value });
    }
  }
  revalidatePath("/admin/dashboard/settings");
  redirect("/admin/dashboard/settings");
}
