import { cookies } from "next/headers";
import { createUser, userExists } from "@/lib/memory-store";

const USER_ID_COOKIE = "kurs_user_id";
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export async function getUserId(): Promise<string | null> {
  const c = await cookies();
  return c.get(USER_ID_COOKIE)?.value ?? null;
}

export async function setUserIdCookie(userId: string) {
  const c = await cookies();
  c.set(USER_ID_COOKIE, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

/**
 * Stellt eine gültige Session her: wenn Cookie fehlt oder User im Store
 * nicht existiert (z.B. nach Server-Neustart), wird ein neuer User angelegt
 * und das Cookie gesetzt.
 */
export async function ensureSession(): Promise<{ userId: string; isNew: boolean }> {
  let userId = await getUserId();
  if (userId && userExists(userId)) {
    return { userId, isNew: false };
  }
  userId = createUser();
  await setUserIdCookie(userId);
  return { userId, isNew: true };
}
