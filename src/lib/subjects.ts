// Feste Subject-Liste (Reihenfolge für Anzeige und Modell)
export const SUBJECTS = [
  "Mathe",
  "Deutsch",
  "Biologie",
  "Chemie",
  "Geschichte",
  "Politik",
  "Musik",
  "Kunst",
  "Informatik",
  "Physik",
  "Geografie",
  "Ethik/Philosophie",
  "Wirtschaft",
] as const;

export type Subject = (typeof SUBJECTS)[number];

export function getSubjectWeightsZero(): Record<string, number> {
  return Object.fromEntries(SUBJECTS.map((s) => [s, 0]));
}
