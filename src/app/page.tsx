"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [starting, setStarting] = useState(false);

  const handleStart = async () => {
    setStarting(true);
    try {
      const res = await fetch("/api/start", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.finished) {
        router.push("/ergebnis");
      } else {
        router.push("/wahl");
      }
    } catch {
      setStarting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-lg text-center space-y-8">
        <h1 className="text-4xl font-extrabold text-sky-800 drop-shadow-sm">
          Dein Kurs-Abenteuer
        </h1>
        <p className="text-lg text-sky-700">
          Wähle 12× den Kurs, der dich mehr interessiert – wie ein kleines Lernspiel.
        </p>
        <p className="text-slate-600 text-sm">
          Aus deinen Entscheidungen berechnen wir ein persönliches Lern-Interessenprofil
          über Schulfächer und zeigen dir passende Kurse.
        </p>
        <button
          type="button"
          onClick={handleStart}
          disabled={starting}
          className="inline-block rounded-full bg-sky-500 text-white px-10 py-3 font-semibold hover:bg-sky-400 active:bg-sky-600 transition disabled:opacity-50 shadow-lg shadow-sky-200"
        >
          {starting ? "…" : "Los geht's"}
        </button>
      </div>
    </main>
  );
}
