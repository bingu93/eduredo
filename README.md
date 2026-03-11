# Kurspräferenz – Lern-Interessenprofil (MVP)

Kindgerechte Webapp für paarweise Kurspräferenz: 12 verwertbare Vergleiche („Welchen Kurs würdest du eher lernen? A oder B“), danach Interessenprofil und personalisierter Feed mit Selbstlernkursen, Live-Kursen und Projekten.

**Vollständige Doku für Agenten/Entwickler:** siehe **PROJECT.md**.

## Tech-Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Next.js Route Handlers
- **Daten:** In-Memory in `src/lib/courses-data.ts` (50 Train-, 105 Test-Kurse: 45 Selbstlern, 30 Live, 30 Projekt)
- **Auth:** anonyme Session per Cookie (`kurs_user_id`)

## Setup (ohne Datenbank)

```bash
npm install
npm run dev
```

App: [http://localhost:3000](http://localhost:3000).

**Optional (PostgreSQL):** `.env` mit `DATABASE_URL`, dann `prisma migrate dev` und `prisma db seed`. App nutzt aktuell nur In-Memory-Store.

## Ablauf

- **Start** (`/`): „Dein Kurs-Abenteuer“, Button „Los geht’s“ → Session, erstes Duell.
- **Wahl** (`/wahl`): 12 verwertbare Entscheidungen, „Beide gleich spannend“ (Tie), **Profil-Button** (Avatar) → `/profil`.
- **Ergebnis/Feed** (`/ergebnis`): Nur **Feed** (quadratische Kurskarten, große Emojis, Typ: Selbstlern/Live/Projekt), **Profil-Button** → `/profil`.
- **Profil** (`/profil`): Interessenprofil mit **Kreisdiagramm**, Legende, Text, Level; Links zu Feed und Wahl.

## API (Route Handlers)

- `POST /api/start` – Session, erstes Duell, Cookie.
- `GET /api/duel` – nächstes Duell (nur Train-Kurse).
- `POST /api/choose` – Body: `{ leftId, rightId, choice: "left"|"right"|"tie" }`; liefert nächstes Duell oder `finished`.
- `GET /api/result` – Profil + **feed** (courseId, title, topSubjects, score, emoji, kind, liveInfo, projectInfo).
- `POST /api/reset` – Session zurücksetzen.

## Modell & Feed

- **Profil:** Pairwise Logit (L2), nur nicht-Tie-Choices; Gewichte auf Summe 1.
- **Feed:** `score = dot(w_user, x_course)`; alle Test-Kurse (Selbstlern, Live, Projekt) gemeinsam sortiert. Kein Platz-X, kein Score-Balken in der UI.

---

## Migration & Seed (bei PostgreSQL-Betrieb)

1. **Schema anwenden**  
   `prisma migrate dev` (erzeugt/wendet Migrationen aus dem Prisma-Schema an).  
   Falls du bereits eine ältere DB hast: Schema enthält jetzt `Course.split` sowie `Choice.isTie` und optionales `Choice.chosenCourseId`; ggf. Migration manuell anlegen oder bestehende Migration um die neuen Felder ergänzen.

2. **Seed (Train + Test)**  
   `pnpm db:seed` bzw. `npx prisma db seed`  
   Legt 50 Train- und 45 Test-Kurse an (insgesamt 95). Bestehende Kurse werden beim Seed gelöscht und neu angelegt.
# eduredo
