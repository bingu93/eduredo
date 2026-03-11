"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FeedItem = {
  courseId: string;
  title: string;
  topSubjects: string[];
  score: number;
  emoji: string;
  kind: "self" | "live" | "project";
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

type ResultData = {
  feed: FeedItem[];
};

export default function ErgebnisPage() {
  const router = useRouter();
  const [data, setData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetch("/api/result", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Nicht genug Entscheidungen.");
        return res.json();
      })
      .then((result) => setData({ feed: result.feed }))
      .catch(() => router.push("/wahl"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleReset = async () => {
    setResetting(true);
    await fetch("/api/reset", { method: "POST", credentials: "include" });
    router.push("/");
    setResetting(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <p className="text-slate-500">Berechne dein Profil …</p>
      </main>
    );
  }

  if (!data) return null;

  return (
    <main className="min-h-screen p-6 bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-50">
      <div className="max-w-3xl mx-auto bg-white/80 rounded-3xl shadow-xl p-6 md:p-8">
        <div className="flex justify-between items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-sky-800">
              Dein Kurs-Feed
            </h1>
            <p className="text-slate-700 text-sm mt-1">
              Hier siehst du Kurse, die gut zu deinem Interessenprofil passen.
            </p>
          </div>
          <Link
            href="/profil"
            className="inline-flex items-center gap-2 rounded-full bg-sky-500 text-white px-4 py-2 text-sm font-semibold hover:bg-sky-400 shadow-md"
          >
            <span className="w-8 h-8 rounded-full bg-sky-300 flex items-center justify-center">
              <span aria-hidden>🙂</span>
            </span>
            <span>Zu deinem Profil</span>
          </Link>
        </div>

        {/* Personalisierter Feed */}
        <section className="mb-8">
          <ul className="space-y-4">
            {data.feed.map((item, index) => (
              <li
                key={item.courseId}
                className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
              >
                <div className="flex flex-col">
                  <div
                    className={`w-full aspect-square rounded-2xl flex items-center justify-center text-[12rem] md:text-[16rem] mb-3 ${
                      item.kind === "self"
                        ? "bg-sky-100"
                        : item.kind === "live"
                        ? "bg-amber-100"
                        : "bg-emerald-100"
                    }`}
                  >
                    <span aria-hidden>{item.emoji}</span>
                  </div>
                  <p
                    className={`text-[10px] uppercase tracking-wide mb-1 ${
                      item.kind === "self"
                        ? "text-sky-600"
                        : item.kind === "live"
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {item.kind === "self"
                      ? "Selbstlernkurs"
                      : item.kind === "live"
                      ? "Live-Kurs"
                      : "Projekt"}
                  </p>
                  <p className="font-semibold text-slate-900 text-sm mb-2">
                    {item.title}
                  </p>
                  {item.kind === "live" && item.liveInfo && (
                    <p className="text-[11px] text-amber-700 mb-2">
                      {item.liveInfo.time} · Mit{" "}
                      {item.liveInfo.experts.join(" & ")}
                    </p>
                  )}
                  {item.kind === "project" && item.projectInfo && (
                    <p className="text-[11px] text-emerald-700 mb-2">
                      Start: {item.projectInfo.startDate} ·{" "}
                      {item.projectInfo.taken}/{item.projectInfo.total} Plätze belegt
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {item.topSubjects.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] text-sky-800 border border-sky-100"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleReset}
            disabled={resetting}
            className="rounded-full bg-sky-500 text-white px-6 py-2 font-semibold hover:bg-sky-400 disabled:opacity-50 shadow-md"
          >
            {resetting ? "…" : "Neu starten"}
          </button>
          <Link
            href="/"
            className="rounded-full border border-slate-300 px-6 py-2 font-medium text-slate-700 hover:bg-slate-50"
          >
            Zur Startseite
          </Link>
        </div>
      </div>
    </main>
  );
}
