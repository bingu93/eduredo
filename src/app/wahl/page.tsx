"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Course = {
  id: string;
  title: string;
  subjectWeights: Record<string, number>;
};

type Duel = {
  left: Course;
  right: Course;
  progress: number;
  total: number;
  verwertbar: number;
  ties: number;
};

function topSubjects(weights: Record<string, number>, n: number): string[] {
  return Object.entries(weights)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([s]) => s);
}

function CourseCard({
  course,
  onClick,
  disabled,
}: {
  course: Course;
  onClick: () => void;
  disabled: boolean;
}) {
  const chips = topSubjects(course.subjectWeights, 3);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full max-w-sm rounded-3xl border-2 border-sky-200 bg-white/90 p-6 text-left shadow-md transition hover:border-sky-400 hover:bg-sky-50 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <h3 className="text-xl font-semibold text-slate-800 mb-3">
        {course.title}
      </h3>
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {chips.map((s) => (
            <span
              key={s}
              className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800 shadow-sm"
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

export default function WahlPage() {
  const router = useRouter();
  const [duel, setDuel] = useState<Duel | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDuel = async () => {
    setError(null);
    try {
      const res = await fetch("/api/duel", { credentials: "include" });
      if (res.status === 400) {
        const startRes = await fetch("/api/start", {
          method: "POST",
          credentials: "include",
        });
        const data = await startRes.json();
        if (data.finished) {
          router.push("/ergebnis");
          return;
        }
        setDuel(data.duel ?? null);
      } else {
        const data = await res.json();
        if (data.finished) {
          router.push("/ergebnis");
          return;
        }
        setDuel(data.duel ?? null);
      }
    } catch {
      setError("Verbindungsfehler");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDuel();
  }, []);

  const choose = async (choice: "left" | "right" | "tie") => {
    if (!duel) return;
    setSubmitting(true);
    setError(null);
    try {
      const body: { leftId: string; rightId: string; chosenId?: string; choice: "left" | "right" | "tie" } = {
        leftId: duel.left.id,
        rightId: duel.right.id,
        choice,
      };
      if (choice === "left") body.chosenId = duel.left.id;
      if (choice === "right") body.chosenId = duel.right.id;
      const res = await fetch("/api/choose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Fehler");
        setSubmitting(false);
        return;
      }
      if (data.finished) {
        router.push("/ergebnis");
        return;
      }
      setDuel(data.duel);
    } catch {
      setError("Netzwerkfehler");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <p className="text-slate-500">Lade …</p>
      </main>
    );
  }

  if (!duel) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-50">
        <div className="bg-white/80 rounded-3xl shadow-xl px-6 py-4 flex flex-col items-center gap-3">
          <p className="text-slate-600 text-sm">Kein Duell verfügbar.</p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-full bg-sky-500 text-white px-5 py-2 text-sm font-semibold hover:bg-sky-400"
          >
            Zurück zur Startseite
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 flex flex-col items-center bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-50">
      <div className="w-full max-w-4xl bg-white/80 rounded-3xl shadow-xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-semibold text-sky-800">
            Kurs-Abenteuer
          </p>
          <button
            type="button"
            onClick={() => router.push("/profil")}
            className="inline-flex items-center gap-2 rounded-full bg-sky-500 text-white px-4 py-1.5 text-xs font-semibold hover:bg-sky-400 shadow-md"
          >
            <span className="w-7 h-7 rounded-full bg-sky-300 flex items-center justify-center">
              <span aria-hidden>🙂</span>
            </span>
            <span>Profil</span>
          </button>
        </div>
        <p className="text-center text-sky-700 mb-1 font-semibold">
          Dein Lern-Abenteuer: {duel.verwertbar} / {duel.total} Entscheidungen
        </p>
        <p className="text-center text-slate-600 text-sm mb-3">
          Verwertbar: {duel.verwertbar} · Gleich: {duel.ties}
        </p>
        <div className="h-3 bg-sky-100 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-emerald-400 to-amber-400 rounded-full transition-all"
            style={{ width: `${(duel.verwertbar / duel.total) * 100}%` }}
          />
        </div>
        <p className="text-center text-slate-700 text-base mb-6">
          Welchen Kurs würdest du lieber ausprobieren?
        </p>
        {error && (
          <p className="text-center text-red-600 text-sm mb-4">{error}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center mb-6">
          <CourseCard
            course={duel.left}
            onClick={() => choose("left")}
            disabled={submitting}
          />
          <CourseCard
            course={duel.right}
            onClick={() => choose("right")}
            disabled={submitting}
          />
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => choose("tie")}
            disabled={submitting}
          className="rounded-full border-2 border-amber-300 bg-amber-50 px-6 py-2 text-amber-800 font-semibold hover:bg-amber-100 disabled:opacity-50"
          >
          Beide gleich spannend
          </button>
        </div>
      </div>
    </main>
  );
}
