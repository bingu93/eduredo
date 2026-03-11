"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CHART_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
  "#14b8a6", "#a855f7", "#eab308",
];

function PieChart({ data }: { data: { subject: string; value: number }[] }) {
  const segments = data.filter((d) => d.value > 0);
  if (segments.length === 0) {
    return (
      <div
        className="w-56 h-56 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-sm"
        aria-hidden
      >
        Keine Daten
      </div>
    );
  }
  const total = segments.reduce((s, d) => s + d.value, 0) || 1;
  let acc = 0;
  const gradientStops = segments
    .map((d, i) => {
      const start = (acc / 100) * 360;
      acc += (d.value / total) * 100;
      const end = (acc / 100) * 360;
      return `${CHART_COLORS[i % CHART_COLORS.length]} ${start}deg ${end}deg`;
    })
    .join(", ");
  return (
    <div
      className="w-56 h-56 rounded-full flex-shrink-0"
      style={{
        background: `conic-gradient(${gradientStops})`,
      }}
      role="img"
      aria-label="Kreisdiagramm der Interessengewichte pro Fach"
    />
  );
}

function Legend({ items }: { items: { subject: string; value: number }[] }) {
  const positiveItems = items.filter((r) => r.value > 0);
  const colorIndex = (subject: string) =>
    positiveItems.findIndex((r) => r.subject === subject);
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
      {items.map((row) => {
        const idx = colorIndex(row.subject);
        const color =
          row.value > 0 && idx >= 0
            ? CHART_COLORS[idx % CHART_COLORS.length]
            : "#e2e8f0";
        return (
          <li key={row.subject} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-slate-700">{row.subject}</span>
            <span className="text-slate-500">{row.value} %</span>
          </li>
        );
      })}
    </ul>
  );
}

type ResultData = {
  table: { subject: string; value: number }[];
  interestWeights: Record<string, number>;
  modelMeta: Record<string, unknown>;
};

export default function ProfilPage() {
  const router = useRouter();
  const [data, setData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/result", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Nicht genug Entscheidungen.");
        return res.json();
      })
      .then((result) =>
        setData({
          table: result.table,
          interestWeights: result.interestWeights,
          modelMeta: result.modelMeta,
        }),
      )
      .catch(() => router.push("/wahl"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <p className="text-slate-500">Lade dein Profil …</p>
      </main>
    );
  }

  if (!data) return null;

  const { table } = data;

  return (
    <main className="min-h-screen p-6 bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-50">
      <div className="max-w-3xl mx-auto bg-white/80 rounded-3xl shadow-xl p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-200">
              <span className="text-3xl" aria-hidden>
                🙂
              </span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-sky-600 font-semibold">
                Dein Lern-Avatar
              </p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-sky-800">
                Dein Interessenprofil
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Basierend auf 12 Entscheidungen in deinem Kurs-Abenteuer.
              </p>
            </div>
          </div>
          <div className="flex-1 flex md:justify-end">
            <div className="inline-flex flex-col items-start rounded-2xl bg-sky-50 border border-sky-200 px-4 py-3 text-xs text-sky-900">
              <p className="font-semibold mb-1">Level 1 · Kurs-Entdecker</p>
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-amber-400">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-[11px]">
                Sammle mehr Entscheidungen, um dein Profil noch genauer zu machen.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-2">
          <p className="text-slate-700 text-sm">
            Jedes Fach bekommt einen Anteil in deinem Kreisdiagramm. Je größer das
            Stück, desto stärker ist dein Interesse an diesem Fach – basierend auf
            den Kursen, die du gewählt hast.
          </p>
        </div>

        <div className="mb-4 flex flex-col items-center sm:flex-row sm:items-start sm:justify-center gap-6">
          <PieChart data={table} />
          <Legend items={table} />
        </div>

        <div className="flex justify-between gap-3 flex-wrap">
          <Link
            href="/ergebnis"
            className="rounded-full bg-sky-500 text-white px-6 py-2 text-sm font-semibold hover:bg-sky-400 shadow-md"
          >
            Zu deinen Kurs-Empfehlungen
          </Link>
          <Link
            href="/wahl"
            className="rounded-full border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Noch mehr Kurse wählen
          </Link>
        </div>
      </div>
    </main>
  );
}

