import { NextResponse } from "next/server";
import { ensureSession } from "@/lib/cookies";
import { resetUser } from "@/lib/memory-store";

export async function POST() {
  const { userId } = await ensureSession();
  resetUser(userId);
  return NextResponse.json({ ok: true });
}
