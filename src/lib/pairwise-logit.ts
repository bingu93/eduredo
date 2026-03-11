import { SUBJECTS } from "./subjects";

export type SubjectWeightsMap = Record<string, number>;

function getWeight(weights: SubjectWeightsMap, subject: string): number {
  return typeof weights[subject] === "number" ? weights[subject] : 0;
}

/** Feature-Vektor d = x_chosen - x_notChosen (subject-wise) */
function diffVector(
  chosen: SubjectWeightsMap,
  notChosen: SubjectWeightsMap
): number[] {
  return SUBJECTS.map((s) => getWeight(chosen, s) - getWeight(notChosen, s));
}

function dot(w: number[], d: number[]): number {
  return w.reduce((sum, wi, i) => sum + wi * d[i], 0);
}

function sigmoid(x: number): number {
  if (x >= 0) return 1 / (1 + Math.exp(-x));
  const e = Math.exp(x);
  return e / (1 + e);
}

/**
 * Regularized Logistic Regression (L2) für Pairwise Choices.
 * minimize: sum_i log(1 + exp(-w·d_i)) + (lambda/2) * ||w||^2
 * Nach Training: negative Gewichte auf 0, dann normalisieren (Summe = 1).
 */
export function trainPairwiseLogit(
  pairs: { chosen: SubjectWeightsMap; notChosen: SubjectWeightsMap }[],
  options: { steps?: number; learningRate?: number; lambda?: number } = {}
): { weights: Record<string, number>; meta: Record<string, unknown> } {
  const steps = options.steps ?? 400;
  const learningRate = options.learningRate ?? 0.1;
  const lambda = options.lambda ?? 0.1;

  const D = SUBJECTS.length;
  const diffs = pairs.map((p) => diffVector(p.chosen, p.notChosen));

  let w = new Array(D).fill(0);

  for (let step = 0; step < steps; step++) {
    const grad = new Array(D).fill(0);
    for (let i = 0; i < diffs.length; i++) {
      const d = diffs[i];
      const z = dot(w, d);
      const factor = sigmoid(z) - 1; // Gradient des Log-Loss
      for (let s = 0; s < D; s++) {
        grad[s] += d[s] * factor;
      }
    }
    for (let s = 0; s < D; s++) {
      grad[s] += lambda * w[s]; // L2
      w[s] -= learningRate * grad[s];
    }
  }

  // Clamp negative to 0
  for (let s = 0; s < D; s++) {
    if (w[s] < 0) w[s] = 0;
  }

  // Normalize so sum = 1
  const sum = w.reduce((a, b) => a + b, 0);
  if (sum > 0) {
    for (let s = 0; s < D; s++) w[s] /= sum;
  } else {
    const uniform = 1 / D;
    for (let s = 0; s < D; s++) w[s] = uniform;
  }

  const weights: Record<string, number> = {};
  SUBJECTS.forEach((s, i) => {
    weights[s] = w[i];
  });

  return {
    weights,
    meta: {
      method: "pairwise_logit",
      nChoices: pairs.length,
      lambda,
      steps,
      learningRate,
    },
  };
}
