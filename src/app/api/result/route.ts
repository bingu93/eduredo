import { NextResponse } from "next/server";
import { ensureSession } from "@/lib/cookies";
import { getProfile, getFeed, getProgress } from "@/lib/memory-store";

const MAX_TRAIN_CHOICES = 12;

export async function GET() {
  const { userId } = await ensureSession();

  const profile = getProfile(userId);
  if (!profile) {
    const { verwertbar } = getProgress(userId);
    return NextResponse.json(
      {
        error: "Not enough choices yet.",
        choicesCount: verwertbar,
        required: MAX_TRAIN_CHOICES,
      },
      { status: 400 }
    );
  }

  const interestWeights = profile.interestWeights;
  const table = Object.entries(interestWeights).map(([subject, value]) => ({
    subject,
    value: Math.round(value * 100),
  }));

  const feed = getFeed(userId) ?? [];

  return NextResponse.json({
    interestWeights,
    table,
    modelMeta: profile.modelMeta,
    feed,
  });
}
