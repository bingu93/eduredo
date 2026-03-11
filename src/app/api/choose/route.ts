import { NextRequest, NextResponse } from "next/server";
import { ensureSession } from "@/lib/cookies";
import {
  getProgress,
  addChoice,
  getNextDuel,
  type ChoiceType,
} from "@/lib/memory-store";

const MAX_TRAIN_CHOICES = 12;

export async function POST(req: NextRequest) {
  const { userId, isNew } = await ensureSession();
  if (isNew) {
    return NextResponse.json(
      { error: "Session abgelaufen (z.B. nach Neustart). Bitte lade die Seite neu und starte von vorne." },
      { status: 400 }
    );
  }

  let body: { leftId: string; rightId: string; chosenId?: string; choice?: ChoiceType };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const { leftId, rightId, choice: choiceParam, chosenId } = body;
  if (!leftId || !rightId) {
    return NextResponse.json(
      { error: "leftId and rightId are required." },
      { status: 400 }
    );
  }

  let choice: ChoiceType;
  if (choiceParam === "tie" || choiceParam === "left" || choiceParam === "right") {
    choice = choiceParam;
  } else if (chosenId === leftId) {
    choice = "left";
  } else if (chosenId === rightId) {
    choice = "right";
  } else {
    return NextResponse.json(
      { error: 'body must include choice: "left" | "right" | "tie", or chosenId equal to leftId or rightId.' },
      { status: 400 }
    );
  }

  const { verwertbar } = getProgress(userId);
  if (verwertbar >= MAX_TRAIN_CHOICES) {
    const { ties } = getProgress(userId);
    return NextResponse.json({
      finished: true,
      duel: null,
      progress: MAX_TRAIN_CHOICES,
      total: MAX_TRAIN_CHOICES,
      verwertbar: MAX_TRAIN_CHOICES,
      ties,
    });
  }

  const result = addChoice(userId, leftId, rightId, choice);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: 400 }
    );
  }

  if (result.finished) {
    return NextResponse.json({
      finished: true,
      duel: null,
      progress: MAX_TRAIN_CHOICES,
      total: MAX_TRAIN_CHOICES,
      verwertbar: result.verwertbar,
      ties: result.ties,
    });
  }

  const duel = getNextDuel(userId);
  return NextResponse.json({
    finished: false,
    duel,
    progress: result.verwertbar,
    total: MAX_TRAIN_CHOICES,
    verwertbar: result.verwertbar,
    ties: result.ties,
  });
}
