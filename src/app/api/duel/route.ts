import { NextResponse } from "next/server";
import { ensureSession } from "@/lib/cookies";
import { getNextDuel, getProgress } from "@/lib/memory-store";

const MAX_TRAIN_CHOICES = 12;

export async function GET() {
  const { userId } = await ensureSession();

  const duel = getNextDuel(userId);
  const { verwertbar, ties } = getProgress(userId);
  return NextResponse.json({
    duel,
    finished: !duel || verwertbar >= MAX_TRAIN_CHOICES,
    verwertbar,
    ties,
  });
}
