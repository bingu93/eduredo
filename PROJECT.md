# Kurspräferenz – Vollständige Projektbeschreibung

Diese Datei beschreibt das Projekt so, dass ein neuer Agent (oder Entwickler) alle Feinheiten, Nutzerwünsche und technischen Besonderheiten versteht und das Projekt weiterführen oder erweitern kann.

---

## 1. Zweck und Nutzerablauf

### Was die App macht
- **Nutzer** treffen **paarweise Vergleiche** zwischen zwei Kursen („Welchen Kurs würdest du eher lernen? A oder B“).
- Es sind **12 verwertbare Entscheidungen** nötig. „Beide gleich interessant“ (Tie) wird **nicht** mitgezählt, verlängert aber die Runde (nächstes Duell erscheint).
- Aus den **nur nicht-Tie-Entscheidungen** wird ein **Interessenprofil** über Schulfächer geschätzt (Pairwise Logit mit L2).
- Unter dem Profil erscheint ein **personalisierter Feed** mit Test-Kursen, sortiert nach Relevanz (Dot-Produkt mit Nutzerprofil).

### Ablauf aus Nutzersicht
1. **Startseite** (`/`): Kindgerechter Text („Dein Kurs-Abenteuer“, „Wähle 12× den Kurs …“), Button „Los geht's“. Klick ruft `POST /api/start` auf und legt die Session an, dann Weiterleitung zu `/wahl`.
2. **Wahl** (`/wahl`): Ein Duell = zwei Kurskarten (Titel + bis zu 3 stärkste Fächer als Chips). Nutzer wählt **links**, **rechts** oder **„Beide gleich spannend“** (Tie). Anzeige: **Counter „Dein Lern-Abenteuer: x / 12“**, Fortschrittsbalken, **Profil-Button** (Avatar/Gesicht) oben rechts → führt zu `/profil`. Nach 12 verwertbaren Entscheidungen Weiterleitung zu `/ergebnis`.
3. **Ergebnis/Feed** (`/ergebnis`): Zeigt **nur den personalisierten Kurs-Feed** (kein Kreisdiagramm hier). Header „Dein Kurs-Feed“, **Profil-Button** (Avatar) → `/profil`. Feed: vertikale Liste von **quadratischen Kurskarten** (siehe unten). Buttons: „Neu starten“, „Zur Startseite“.
4. **Profil** (`/profil`): **Interessenprofil inkl. Text, Kreisdiagramm (Pie Chart) und Legende (Zahlen/Prozent)**. Avatar-Karte, Level-Badge, Sterne, erklärender Text. Buttons: „Zu deinen Kurs-Empfehlungen“ (`/ergebnis`), „Noch mehr Kurse wählen“ (`/wahl`). Erreichbar über den **Profilbutton mit Gesicht** auf `/wahl` und `/ergebnis`.

---

## 2. Technischer Stack (unverändert gewünscht)

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Next.js Route Handlers (keine separate API)
- **Daten:** Aktuell **In-Memory** (hardcodierte Kurse in `src/lib/courses-data.ts`); optional **PostgreSQL + Prisma** (Schema und Seed vorhanden, Routen nutzen aber den Memory-Store)
- **Auth:** Anonyme Session per **Cookie** (`kurs_user_id`), kein Login

---

## 3. Datenmodell und Konzepte

### 3.1 Feste Subject-Liste
- Definiert in **`src/lib/subjects.ts`**: Mathe, Deutsch, Biologie, Chemie, Geschichte, Politik, Musik, Kunst, Informatik, Physik, Geografie, Ethik/Philosophie, Wirtschaft.
- Alle Kursvektoren (`subjectWeights`) und das Nutzerprofil (`interestWeights`) nutzen genau diese Keys (fehlende = 0).

### 3.2 Train- vs. Test-Split
- **Train-Kurse** (`split: "train"`): Nur diese werden in **Duelle** gezeigt. Mindestens so viele, dass 12 verschiedene Paare möglich sind; aktuell **50** Kurse in `courses-data.ts` (alle `kind: "self"`).
- **Test-Kurse** (`split: "test"`): **Nur im Feed** sichtbar, nie in Duelle. Aktuell **105** Kurse: 45 Selbstlernkurse, 30 Live-Kurse, 30 Projekte (alle in `courses-data.ts`, gemeinsam nach Score gerankt).
- Duell-Logik verwendet ausschließlich `getTrainCourses()`; Feed verwendet `getTestCourses()`.

### 3.2a Kursarten (kind) und Zusatzinfos
- **CourseRecord** in `courses-data.ts` hat: `id`, `title`, `subjectWeights`, `split`, `emoji`, **`kind`** (`"self"` | `"live"` | `"project"`), optional **`liveInfo`**, optional **`projectInfo`**.
- **Selbstlernkurse** (`kind: "self"`): Alle bisherigen Kurse; Titel als **kindgerechte Frage zuerst** (z. B. „Wie machen Bienen eigentlich Honig? – Einblick in die Imkerei“). Im Feed **blau** hervorgehoben (Hintergrund Emoji-Quadrat, Label).
- **Live-Kurse** (`kind: "live"`): Fiktive Expert:innen, **feste Uhrzeit** (`liveInfo.time`), `liveInfo.experts` (z. B. „KI-Experte Andy“). Emoji = **Menschen-Emoji** (Haar-/Hautfarben). Im Feed **gold/amber** hervorgehoben.
- **Projekte** (`kind: "project"`): Titel ohne Frage, eher aktiv (z. B. „Abenteuer Terrarium: Wir bauen ein Biotop!“). **Startdatum** (`projectInfo.startDate`) und **Teilnehmerzahl** (`projectInfo.taken`/`total`, z. B. „3/6 Plätze belegt“). Im Feed **grün** hervorgehoben.
- Jeder Kurs hat ein **passendes Emoji** (`emoji`); bei Live-Kursen immer Menschen-Emojis für die Experten.

### 3.3 Zähl- und Stoplogik
- **Verwertbar (k):** Anzahl der gespeicherten Choices mit `isTie === false`. Session endet, wenn **k = 12**.
- **Gleich (t):** Anzahl der Tie-Entscheidungen. Erhöht sich bei „Beide gleich interessant“, **k** bleibt gleich.
- Tie-Entscheidungen werden **gespeichert** (für Analytics), fließen aber **nicht** in die Modellberechnung ein.

### 3.4 Pair-Reuse (Robustheit)
- Ein Nutzer soll **nie zweimal dasselbe Paar** (A, B) sehen – unabhängig von der Reihenfolge: (A,B) und (B,A) gelten als dasselbe (normalisiert über `pairKey(a,b) = [a,b].sort().join("_")`).
- **Ties zählen als „gesehen“**: Das Paar wird nach einem Tie nicht erneut angeboten. Die Kurse A und B können aber in **anderen** Paarungen wieder vorkommen.

### 3.5 In-Memory-Store (`src/lib/memory-store.ts`)
- **users:** Set von User-IDs.
- **choicesByUser:** Map userId → Array von `Choice` (id, userId, leftCourseId, rightCourseId, chosenCourseId | null, isTie).
- **profilesByUser:** Map userId → UserProfile (interestWeights, modelMeta).
- Nach **Server-Neustart** ist der Store leer; die Cookie-User-ID kann dann „verwaist“ sein. Dafür gibt es **`ensureSession()`** (siehe unten).

### 3.6 Session und Cookie
- **Cookie-Name:** `kurs_user_id`. Wird in Route Handlers über `setUserIdCookie(userId)` gesetzt.
- **ensureSession()** (`src/lib/cookies.ts`): Stellt sicher, dass jede Route eine gültige Session hat. Wenn kein Cookie oder der User im Store nicht existiert (z. B. nach Neustart), wird ein **neuer User** angelegt und das Cookie gesetzt. So erscheint nie „No session“ beim Aufruf von `/wahl` oder `/ergebnis`; Nutzer startet ggf. bei 0/12.
- **POST /api/choose**: Wenn dabei ein **neuer** User erzeugt wurde (`isNew`), wird die aktuelle Wahl verworfen und eine Meldung „Session abgelaufen …“ zurückgegeben (Cookie ist aber bereits gesetzt für den nächsten Request).

---

## 4. API (Route Handlers) – Übersicht

| Route | Methode | Zweck |
|-------|---------|--------|
| `/api/start` | POST | `ensureSession()`, dann erstes Duell zurückgeben (oder `finished`). Response: `userId`, `duel`, `finished`, `verwertbar`, `ties`. |
| `/api/duel` | GET | Nächstes Duell für aktuelle Session (nur Train-Kurse). Response: `duel`, `finished`, `verwertbar`, `ties`. |
| `/api/choose` | POST | Body: `leftId`, `rightId`, `choice: "left" | "right" | "tie"` (alternativ `chosenId`). Speichert Choice; bei Tie `chosenCourseId = null`, `isTie = true`. Liefert nächstes Duell oder `finished: true`, sowie `verwertbar`, `ties`. Bei `isNew` Session: 400 mit Hinweis. |
| `/api/result` | GET | Profil und **feed** (alle Test-Kurse nach Score sortiert). Response: `interestWeights`, `table`, `modelMeta`, `feed` (Array: `courseId`, `title`, `topSubjects`, `score`, `emoji`, `kind`, optional `liveInfo` { time, experts }, optional `projectInfo` { startDate, taken, total }). |
| `/api/reset` | POST | Alle Choices und das Profil der aktuellen Session löschen („Neu starten“). |

- **Validierung:** `chosenId` muss `leftId` oder `rightId` sein; dasselbe Paar (inkl. Tie) darf pro User nur einmal vorkommen; nur Train-Kurs-IDs für Duelle.

---

## 5. Modell und Feed-Ranking

### 5.1 Pairwise Logit (Training)
- **Eingabe:** Nur Choices mit `isTie === false`. Pro Choice: Feature **d = x_chosen − x_notChosen** (subject-weise).
- **Ziel:** Minimize `sum_i log(1 + exp(-w·d_i)) + (lambda/2) * ||w||^2` (L2-regularisierte logistische Regression).
- **Implementierung:** `src/lib/pairwise-logit.ts`, Gradientenabstieg (Steps, Learning Rate, Lambda konfigurierbar; Default 400, 0.1, 0.1). Nach Training: negative Gewichte auf 0 setzen, dann auf **Summe 1** normalisieren (falls Summe 0 → uniform).
- **Profil-Meta:** `nTrainChoices` (12), `nTies`, `method`, `lambda`, `lr`, `steps` werden im Profil gespeichert.

### 5.2 Feed-Ranking
- **Formel:** `score(course) = dot(w_user, x_course)` (Dot-Produkt über alle Subjects). Dot statt Cosine: einfacher und interpretierbar; Skalierung der Gewichte ist bereits sinnvoll.
- **Alle** Test-Kurse (Selbstlern, Live, Projekt) werden gemeinsam nach **score** absteigend sortiert. Im Feed: quadratische Karte pro Eintrag mit **sehr großem Emoji** (CSS z. B. `text-[12rem]`/`text-[16rem]`), Typ-Label (Selbstlernkurs / Live-Kurs / Projekt), Titel, Fächer-Chips; bei Live: Uhrzeit + Experten; bei Projekt: Startdatum + „x/y Plätze belegt“. **Kein** „Platz 1/2…“-Text, **kein** Score-Balken, **kein** Schatzkarten-Erklärtext.

---

## 6. Wichtige Dateien und Struktur

```
kurs-praferenz/
├── prisma/
│   ├── schema.prisma       # Course (split), Choice (isTie, chosenCourseId?), UserProfile
│   ├── seed.ts             # Train + Test Kurse für DB-Betrieb (50 + 105 Test = 155 aktuell nur in courses-data)
│   └── migrations/         # Schema-Änderungen (split, isTie)
├── src/
│   ├── app/
│   │   ├── page.tsx        # Landing (kindgerecht); "Los geht's" → POST /api/start, dann /wahl oder /ergebnis
│   │   ├── wahl/page.tsx   # Duell: Counter "x / 12", Profil-Button (Avatar), Karten + "Beide gleich spannend"
│   │   ├── ergebnis/page.tsx # Nur Feed: quadratische Kurskarten (Emoji groß), Profil-Button, kein Diagramm
│   │   ├── profil/page.tsx # Interessenprofil: Kreisdiagramm, Legende, Text, Level/Avatar, Links zu /ergebnis, /wahl
│   │   └── api/
│   │       ├── start/route.ts
│   │       ├── duel/route.ts
│   │       ├── choose/route.ts
│   │       ├── result/route.ts
│   │       └── reset/route.ts
│   └── lib/
│       ├── subjects.ts     # SUBJECTS-Liste
│       ├── courses-data.ts # TRAIN_COURSES (50), TEST_COURSES (105: 45 self, 30 live, 30 project); CourseRecord mit emoji, kind, liveInfo, projectInfo
│       ├── memory-store.ts # getFeed liefert FeedItem mit kind, liveInfo, projectInfo, emoji; getTrainCourses/getTestCourses
│       ├── cookies.ts      # getUserId, setUserIdCookie, ensureSession
│       └── pairwise-logit.ts # trainPairwiseLogit()
├── PROJECT.md              # Diese Datei (Vollständige Agent-/Entwickler-Doku)
└── README.md               # Setup, Ablauf, API-Kurzreferenz
```

---

## 7. Konstante: 12 verwertbare Entscheidungen

- **Eine zentrale Konstante:** `MAX_TRAIN_CHOICES = 12` in **`src/lib/memory-store.ts`**.
- Die API-Routen importieren sie lokal oder nutzen die Logik aus dem Store (getNextDuel, addChoice, getProfile). Bei Änderung der gewünschten Anzahl (z. B. 10 oder 15) muss **überall** dieselbe Konstante verwendet werden; aktuell ist sie in `memory-store.ts` und in jeder Route als lokale Konstante dupliziert (12). Empfehlung: Konstante nur in `memory-store.ts` definieren und in den Routen von dort importieren oder aus der Store-Logik ableiten.

---

## 8. UI-Besonderheiten (kindgerechte Lernplattform)

- **Gesamtstil:** Spielerisch, für Kinder: Gradient-Hintergründe (z. B. sky → emerald → amber), runde Buttons, freundliche Formulierungen („Kurs-Abenteuer“, „Beide gleich spannend“). Kein „Platz 1/2…“, kein Score-Balken, kein Schatzkarten-Satz im Feed.
- **Counter auf der Duell-Seite:** „Dein Lern-Abenteuer: x / 12“, „Verwertbar: x · Gleich: t“, Fortschrittsbalken (farbig). **Profil-Button** (kleines Avatar-Gesicht + „Profil“) oben rechts → `/profil`.
- **Profilseite** (`/profil`): Interessenprofil **nur hier** – Kreisdiagramm (Pie Chart) mit `conic-gradient`, Legende (Farbpunkt, Fach, Prozent), Avatar-Karte, Level/Sterne, erklärender Text. Keine Tabelle, keine Balkendiagramme. Links zu Feed und Wahl.
- **Feed-Seite** (`/ergebnis`): Zeigt **nur** den Feed. Jede Lerneinheit = **quadratische Karte**: oben **sehr großes Emoji** (z. B. `text-[12rem]` / `text-[16rem]`), darunter Label (Selbstlernkurs / Live-Kurs / Projekt), Titel, Fächer-Chips; bei Live: Uhrzeit + Experten; bei Projekt: Startdatum + „x/y Plätze belegt“. Farbcodierung: Selbstlern = blau, Live = gold/amber, Projekt = grün. **Kein** Platz-Text, **kein** Passungs-Balken.
- **Landing:** „Dein Kurs-Abenteuer“, „Wähle 12× den Kurs …“; „Los geht's“ ruft `POST /api/start` mit `credentials: "include"` auf.
- **Alle fetches** nutzen `credentials: "include"`, damit das Session-Cookie mitgeschickt wird.

---

## 9. Nutzerwünsche und Erweiterungshistorie (Kurz)

- **12 verwertbare Entscheidungen;** Tie zählt nicht; Tie-Option „Beide gleich spannend“, Paar nicht wieder anzeigen.
- **Kindgerechte Lernplattform:** UI spielerisch (Gradienten, runde Buttons, kindliche Formulierungen). Kurse mit **Frage zuerst** („Wie machen Bienen Honig? – …“). Projekte aktiv formuliert („Abenteuer Terrarium: Wir bauen ein Biotop!“).
- **Profil ausgelagert:** Interessenprofil (Text, Diagramm, Zahlen) nur auf **/profil**. Zugang über **Profilbutton mit Gesicht/Avatar** auf `/wahl` und `/ergebnis`. Feed-Seite zeigt nur noch den Feed.
- **Drei Kursarten im Feed:** Selbstlernkurse (blau), Live-Kurse (gold, Uhrzeit + Experten, Menschen-Emoji), Projekte (grün, Startdatum + Plätze x/y). Alle gemeinsam nach Score gerankt; Darstellung ohne „Platz X“, ohne Score-Balken, ohne Schatzkarten-Text.
- **Emojis:** Jeder Kurs hat `emoji`; im Feed sehr groß dargestellt (`text-[12rem]`/`text-[16rem]`). Live-Kurse: Menschen-Emojis für Experten (Haar-/Hautfarben).
- **Session robust:** `ensureSession()` verhindert „No session“ nach Neustart. Counter „x / 12“ auf der Duell-Seite.

---

## 10. Optional: PostgreSQL + Prisma

- **Schema:** Siehe `prisma/schema.prisma`. Course hat `split` ("train"|"test"); Choice hat `isTie` und optionales `chosenCourseId`.
- **Seed:** `prisma/seed.ts` legt 50 Train- und 45 Test-Kurse an (gleiche Titel und subjectWeights wie in `courses-data.ts`).
- **Hinweis:** Die **App-Routen lesen/schreiben aktuell nur den In-Memory-Store**. Für echten DB-Betrieb müssten die Route Handlers und ggf. ein gemeinsamer Service auf Prisma umgestellt werden; die fachliche Logik (12 verwertbar, Tie, Pair-Reuse, Feed-Ranking) bleibt gleich.

---

---

## 11. Für neue Agenten: Schnellüberblick

- **Zuerst diese Datei (PROJECT.md) lesen** – sie ist die zentrale Referenz für Zweck, Ablauf, Datenmodell, API und UI.
- **Konstante 12:** `MAX_TRAIN_CHOICES = 12` in `memory-store.ts` und in den API-Routen; überall konsistent halten.
- **Kursdaten:** `src/lib/courses-data.ts` – `CourseRecord` mit `emoji`, `kind` ("self"|"live"|"project"), `liveInfo`, `projectInfo`. Train = 50 (nur self), Test = 105 (45 self + 30 live + 30 project).
- **Seiten:** `/` Landing, `/wahl` Duell + Profil-Button, `/ergebnis` nur Feed + Profil-Button, `/profil` Interessenprofil (Diagramm, Legende, Text).
- **Feed:** Kein Platz-X-Text, kein Score-Balken, kein Schatzkarten-Satz; Emojis sehr groß; Farben nach kind (blau/gold/grün).

Mit dieser Beschreibung kann ein neuer Agent das Projekt vollständig durchdringen, Besonderheiten und Nutzerwünsche berücksichtigen und Änderungen konsistent umsetzen.
