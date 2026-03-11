import { getTrainCourses, getTestCourses, type CourseRecord, type CourseKind } from "./courses-data";
import { trainPairwiseLogit } from "./pairwise-logit";
import { SUBJECTS } from "./subjects";

const MAX_TRAIN_CHOICES = 12;

export type ChoiceType = "left" | "right" | "tie";

type Choice = {
  id: string;
  userId: string;
  leftCourseId: string;
  rightCourseId: string;
  chosenCourseId: string | null;
  isTie: boolean;
};

type UserProfile = {
  userId: string;
  interestWeights: Record<string, number>;
  modelMeta: Record<string, unknown>;
};

const users = new Set<string>();
const choicesByUser = new Map<string, Choice[]>();
const profilesByUser = new Map<string, UserProfile>();

let choiceIdCounter = 0;
function nextId() {
  return `ch-${++choiceIdCounter}-${Date.now()}`;
}

function pairKey(a: string, b: string): string {
  return [a, b].sort().join("_");
}

export function createUser(): string {
  const userId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  users.add(userId);
  choicesByUser.set(userId, []);
  return userId;
}

export function getChoices(userId: string): Choice[] {
  return choicesByUser.get(userId) ?? [];
}

/** Anzahl verwertbarer (nicht-Tie) und Tie-Entscheidungen. */
export function getProgress(userId: string): { verwertbar: number; ties: number } {
  const choices = getChoices(userId);
  let verwertbar = 0;
  let ties = 0;
  for (const c of choices) {
    if (c.isTie) ties++;
    else verwertbar++;
  }
  return { verwertbar, ties };
}

export function getNextDuel(userId: string): {
  left: { id: string; title: string; subjectWeights: Record<string, number> };
  right: { id: string; title: string; subjectWeights: Record<string, number> };
  progress: number;
  total: number;
  verwertbar: number;
  ties: number;
} | null {
  const choices = getChoices(userId);
  const { verwertbar, ties } = getProgress(userId);
  if (verwertbar >= MAX_TRAIN_CHOICES) return null;

  const trainCourses = getTrainCourses();
  const usedPairs = new Set(choices.map((c) => pairKey(c.leftCourseId, c.rightCourseId)));
  const ids = trainCourses.map((c) => c.id);
  if (ids.length < 2) return null;

  let leftId: string, rightId: string;
  let attempts = 0;
  do {
    leftId = ids[Math.floor(Math.random() * ids.length)];
    rightId = ids[Math.floor(Math.random() * ids.length)];
    if (leftId === rightId) continue;
    if (!usedPairs.has(pairKey(leftId, rightId))) break;
    attempts++;
  } while (attempts < 100);

  if (leftId === rightId || usedPairs.has(pairKey(leftId, rightId))) {
    leftId = ids[0];
    rightId = ids[1];
    if (leftId === rightId && ids.length > 2) rightId = ids[2];
  }

  const left = trainCourses.find((c) => c.id === leftId)!;
  const right = trainCourses.find((c) => c.id === rightId)!;
  return {
    left: { id: left.id, title: left.title, subjectWeights: left.subjectWeights },
    right: { id: right.id, title: right.title, subjectWeights: right.subjectWeights },
    progress: verwertbar,
    total: MAX_TRAIN_CHOICES,
    verwertbar,
    ties,
  };
}

export function addChoice(
  userId: string,
  leftId: string,
  rightId: string,
  choice: ChoiceType
): { ok: true; finished: boolean; verwertbar: number; ties: number } | { ok: false; error: string } {
  const trainCourses = getTrainCourses();
  const trainIds = new Set(trainCourses.map((c) => c.id));
  if (!trainIds.has(leftId) || !trainIds.has(rightId) || leftId === rightId) {
    return { ok: false, error: "leftId and rightId must be distinct train course ids." };
  }

  const choices = getChoices(userId);
  const { verwertbar } = getProgress(userId);
  if (verwertbar >= MAX_TRAIN_CHOICES) {
    return { ok: true, finished: true, verwertbar, ties: getProgress(userId).ties };
  }

  const existing = choices.some(
    (c) =>
      (c.leftCourseId === leftId && c.rightCourseId === rightId) ||
      (c.leftCourseId === rightId && c.rightCourseId === leftId)
  );
  if (existing) {
    return { ok: false, error: "This pair was already shown." };
  }

  const isTie = choice === "tie";
  const chosenCourseId = isTie ? null : choice === "left" ? leftId : rightId;

  const list = choicesByUser.get(userId)!;
  list.push({
    id: nextId(),
    userId,
    leftCourseId: leftId,
    rightCourseId: rightId,
    chosenCourseId,
    isTie,
  });

  const { verwertbar: newVerwertbar, ties: newTies } = getProgress(userId);

  if (newVerwertbar >= MAX_TRAIN_CHOICES) {
    const nonTieChoices = list.filter((c) => !c.isTie);
    const pairs = nonTieChoices.map((c) => {
      const left = trainCourses.find((x) => x.id === c.leftCourseId)!;
      const right = trainCourses.find((x) => x.id === c.rightCourseId)!;
      const chosen = c.chosenCourseId === c.leftCourseId ? left : right;
      const notChosen = c.chosenCourseId === c.leftCourseId ? right : left;
      return { chosen: chosen.subjectWeights, notChosen: notChosen.subjectWeights };
    });
    const { weights, meta } = trainPairwiseLogit(pairs, {
      steps: 400,
      learningRate: 0.1,
      lambda: 0.1,
    });
    profilesByUser.set(userId, {
      userId,
      interestWeights: weights,
      modelMeta: {
        ...meta,
        nTrainChoices: newVerwertbar,
        nTies: newTies,
        method: "pairwise_logit",
        lambda: 0.1,
        lr: 0.1,
        steps: 400,
      },
    });
    return { ok: true, finished: true, verwertbar: newVerwertbar, ties: newTies };
  }
  return { ok: true, finished: false, verwertbar: newVerwertbar, ties: newTies };
}

export function getProfile(userId: string): UserProfile | null {
  let profile = profilesByUser.get(userId) ?? null;
  if (!profile) {
    const choices = getChoices(userId);
    const nonTie = choices.filter((c) => !c.isTie);
    if (nonTie.length < MAX_TRAIN_CHOICES) return null;
    const trainCourses = getTrainCourses();
    const pairs = nonTie.map((c) => {
      const left = trainCourses.find((x) => x.id === c.leftCourseId)!;
      const right = trainCourses.find((x) => x.id === c.rightCourseId)!;
      const chosen = c.chosenCourseId === c.leftCourseId ? left : right;
      const notChosen = c.chosenCourseId === c.leftCourseId ? right : left;
      return { chosen: chosen.subjectWeights, notChosen: notChosen.subjectWeights };
    });
    const { weights, meta } = trainPairwiseLogit(pairs, {
      steps: 400,
      learningRate: 0.1,
      lambda: 0.1,
    });
    const { verwertbar, ties } = getProgress(userId);
    profile = {
      userId,
      interestWeights: weights,
      modelMeta: {
        ...meta,
        nTrainChoices: verwertbar,
        nTies: ties,
        method: "pairwise_logit",
        lambda: 0.1,
        lr: 0.1,
        steps: 400,
      },
    };
    profilesByUser.set(userId, profile);
  }
  return profile;
}

/**
 * Content-based Ranking: score(course) = w_user · x_course (Dot-Produkt).
 * Dot statt Cosine: Nutzergewichte und Kursgewichte sind bereits sinnvoll skaliert (0..1);
 * Längen-Normalisierung würde kleine Präferenzen unterdrücken. Dot ist interpretierbar und robust.
 */
function scoreCourse(userWeights: Record<string, number>, course: CourseRecord): number {
  let s = 0;
  for (const sub of SUBJECTS) {
    const uw = userWeights[sub] ?? 0;
    const cw = (course.subjectWeights[sub] as number) ?? 0;
    s += uw * cw;
  }
  return s;
}

function topSubjects(weights: Record<string, number>, n: number): string[] {
  return Object.entries(weights)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([s]) => s);
}

export type FeedItem = {
  courseId: string;
  title: string;
  topSubjects: string[];
  score: number;
  emoji: string;
  kind: CourseKind;
  liveInfo?: {
    time: string;
    experts: string[];
  };
  projectInfo?: {
    startDate: string;
    taken: number;
    total: number;
  };
};

export function getFeed(userId: string): FeedItem[] | null {
  const profile = getProfile(userId);
  if (!profile) return null;
  const testCourses = getTestCourses();
  const scored = testCourses.map((course) => ({
    course,
    score: scoreCourse(profile.interestWeights, course),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.map(({ course, score }) => ({
    courseId: course.id,
    title: course.title,
    topSubjects: topSubjects(course.subjectWeights, 3),
    emoji: course.emoji,
    kind: course.kind,
    liveInfo: course.liveInfo,
    projectInfo: course.projectInfo,
    score: Math.round(score * 1000) / 1000,
  }));
}

export function resetUser(userId: string): void {
  choicesByUser.set(userId, []);
  profilesByUser.delete(userId);
}

export function userExists(userId: string): boolean {
  return users.has(userId);
}
