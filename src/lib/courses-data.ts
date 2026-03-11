// Hardcodierte Kurse (ohne DB) – Train- und Test-Split

export type SubjectWeightsMap = Record<string, number>;
export type CourseSplit = "train" | "test";

export type CourseKind = "self" | "live" | "project";

export type CourseRecord = {
  id: string;
  title: string;
  subjectWeights: SubjectWeightsMap;
  split: CourseSplit;
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

/** Train-Set: viele Kurse für Duelle (nur diese werden gepaart); 12 verwertbare Entscheidungen nötig. */
const TRAIN_COURSES: CourseRecord[] = [
  { id: "c1", title: "Wie kann man Demokratie ausrechnen? – Die Mathematik der Demokratie", subjectWeights: { Mathe: 0.4, Politik: 0.5, Geschichte: 0.2 }, split: "train", emoji: "🧮", kind: "self" },
  { id: "c2", title: "Wie machen Bienen eigentlich Honig? – Einblick in die Imkerei", subjectWeights: { Biologie: 0.7, Chemie: 0.2 }, split: "train", emoji: "🐝", kind: "self" },
  { id: "c3", title: "Wie wurden aus Kringeln Emojis? – Geschichte der Schrift", subjectWeights: { Deutsch: 0.5, Geschichte: 0.6, Kunst: 0.2 }, split: "train", emoji: "✏️", kind: "self" },
  { id: "c4", title: "Warum sehen Kontinente so aus? – Klima und Geografie der Erde", subjectWeights: { Geografie: 0.8, Physik: 0.2, Politik: 0.2 }, split: "train", emoji: "🌍", kind: "self" },
  { id: "c5", title: "Wie entscheiden Apps für dich mit? – Algorithmen im Alltag", subjectWeights: { Informatik: 0.6, "Ethik/Philosophie": 0.4, Wirtschaft: 0.2 }, split: "train", emoji: "📱", kind: "self" },
  { id: "c6", title: "Was steckt in einer Tablette? – Moleküle und Medizin", subjectWeights: { Chemie: 0.7, Biologie: 0.5 }, split: "train", emoji: "🧪", kind: "self" },
  { id: "c7", title: "Warum verändern Revolutionen ganze Länder? – Geschichte und Folgen", subjectWeights: { Geschichte: 0.8, Politik: 0.5, "Ethik/Philosophie": 0.2 }, split: "train", emoji: "⚔️", kind: "self" },
  { id: "c8", title: "Warum klingt Musik harmonisch? – Musik und Mathematik", subjectWeights: { Musik: 0.6, Mathe: 0.5 }, split: "train", emoji: "🎵", kind: "self" },
  { id: "c9", title: "Kann Wirtschaft auch fair sein? – Märkte und Moral", subjectWeights: { Wirtschaft: 0.6, "Ethik/Philosophie": 0.5, Politik: 0.3 }, split: "train", emoji: "⚖️", kind: "self" },
  { id: "c10", title: "Wie clever ist künstliche Intelligenz wirklich? – Grundlagen und Grenzen", subjectWeights: { Informatik: 0.7, Mathe: 0.3, "Ethik/Philosophie": 0.3 }, split: "train", emoji: "🤖", kind: "self" },
  { id: "c11", title: "Warum träumen Romantiker so wild? – Literatur der Romantik", subjectWeights: { Deutsch: 0.8, Kunst: 0.2, Geschichte: 0.2 }, split: "train", emoji: "📖", kind: "self" },
  { id: "c12", title: "Was passiert, wenn ein Wald kippt? – Ökosysteme im Wandel", subjectWeights: { Biologie: 0.7, Geografie: 0.3, Chemie: 0.2 }, split: "train", emoji: "🌱", kind: "self" },
  { id: "c13", title: "Wer bestimmt eigentlich im Staat? – Einführung in die Politikwissenschaft", subjectWeights: { Politik: 0.8, Geschichte: 0.4, Wirtschaft: 0.2 }, split: "train", emoji: "🏛️", kind: "self" },
  { id: "c14", title: "Wie bekommt man Tiefe auf Papier? – Zeichnen und Perspektive", subjectWeights: { Kunst: 0.7, Mathe: 0.3 }, split: "train", emoji: "🎨", kind: "self" },
  { id: "c15", title: "Was geschah nach dem Urknall? – Astrophysik für Einsteiger", subjectWeights: { Physik: 0.8, Mathe: 0.3 }, split: "train", emoji: "🌌", kind: "self" },
  { id: "c16", title: "Warum funktionieren Sprachen so unterschiedlich? – Grammatik der Welt", subjectWeights: { Deutsch: 0.6, "Ethik/Philosophie": 0.2 }, split: "train", emoji: "🗣️", kind: "self" },
  { id: "c17", title: "Wie wird Gift zur Medizin? – Chemie der Arzneimittel", subjectWeights: { Chemie: 0.7, Biologie: 0.4 }, split: "train", emoji: "💊", kind: "self" },
  { id: "c18", title: "Warum wachsen Städte immer weiter? – Urbanistik", subjectWeights: { Geografie: 0.5, Politik: 0.4, Wirtschaft: 0.3 }, split: "train", emoji: "🏙️", kind: "self" },
  { id: "c19", title: "Wie bringst du den Computer zum Machen? – Programmieren mit Python", subjectWeights: { Informatik: 0.9, Mathe: 0.2 }, split: "train", emoji: "🐍", kind: "self" },
  { id: "c20", title: "Macht Glück lernbar? – Philosophie des Glücks", subjectWeights: { "Ethik/Philosophie": 0.9, Geschichte: 0.2 }, split: "train", emoji: "😊", kind: "self" },
  { id: "c21", title: "Warum fällt alles nach unten? – Bewegung und Kräfte", subjectWeights: { Physik: 0.8, Mathe: 0.4 }, split: "train", emoji: "⚙️", kind: "self" },
  { id: "c22", title: "Wie überzeugst du ein Publikum? – Rhetorik und Reden", subjectWeights: { Deutsch: 0.6, Politik: 0.4 }, split: "train", emoji: "🎤", kind: "self" },
  { id: "c23", title: "Warum sehen Tiere so unterschiedlich aus? – Evolution und Verhalten", subjectWeights: { Biologie: 0.8, "Ethik/Philosophie": 0.2 }, split: "train", emoji: "🧬", kind: "self" },
  { id: "c24", title: "Wie funktioniert die Börse? – Wirtschaft zum Mitdenken", subjectWeights: { Wirtschaft: 0.8, Mathe: 0.2, Politik: 0.2 }, split: "train", emoji: "📈", kind: "self" },
  { id: "c25", title: "Wie mischt man starke Bilder? – Farben und Formen", subjectWeights: { Kunst: 0.8, Chemie: 0.1 }, split: "train", emoji: "🖌️", kind: "self" },
  { id: "c26", title: "Kann ein Computer komponieren? – Musik und Technik", subjectWeights: { Musik: 0.6, Informatik: 0.4 }, split: "train", emoji: "🎧", kind: "self" },
  { id: "c27", title: "Was bleibt vom Kolonialismus? – Geschichte und Gegenwart", subjectWeights: { Geschichte: 0.7, Geografie: 0.4, Politik: 0.4 }, split: "train", emoji: "🗺️", kind: "self" },
  { id: "c28", title: "Kann man Zahlen trauen? – Statistik kritisch lesen", subjectWeights: { Mathe: 0.6, Politik: 0.3, Wirtschaft: 0.2 }, split: "train", emoji: "📊", kind: "self" },
  { id: "c29", title: "Wie retten wir den Planeten? – Nachhaltigkeit verstehen", subjectWeights: { Wirtschaft: 0.4, Geografie: 0.4, Biologie: 0.3, Politik: 0.2 }, split: "train", emoji: "♻️", kind: "self" },
  { id: "c30", title: "Wer sieht deine Daten? – Ethik der Digitalisierung", subjectWeights: { "Ethik/Philosophie": 0.6, Informatik: 0.3, Politik: 0.3 }, split: "train", emoji: "🔐", kind: "self" },
  { id: "c31", title: "Wie tanzen Wellen durch die Luft? – Wellen und Schwingungen", subjectWeights: { Physik: 0.6, Musik: 0.3, Mathe: 0.2 }, split: "train", emoji: "📶", kind: "self" },
  { id: "c32", title: "Warum erzählen wir alte Sagen immer neu? – Mythos und Moderne", subjectWeights: { Deutsch: 0.6, Geschichte: 0.5, "Ethik/Philosophie": 0.2 }, split: "train", emoji: "🏺", kind: "self" },
  { id: "c33", title: "Darf man in Gene eingreifen? – Genetik und Gentechnik", subjectWeights: { Biologie: 0.7, Chemie: 0.3, "Ethik/Philosophie": 0.2 }, split: "train", emoji: "🧬", kind: "self" },
  { id: "c34", title: "Wie baut man seine erste Webseite? – HTML, CSS und JavaScript", subjectWeights: { Informatik: 0.7, Kunst: 0.2 }, split: "train", emoji: "💻", kind: "self" },
  { id: "c35", title: "Welche Länder gehören zu Europa? – Länder und Kulturen", subjectWeights: { Geografie: 0.7, Geschichte: 0.3 }, split: "train", emoji: "🇪🇺", kind: "self" },
  { id: "c36", title: "Kann man Spiele mit Mathe gewinnen? – Spieltheorie", subjectWeights: { Mathe: 0.6, Wirtschaft: 0.4, Politik: 0.2 }, split: "train", emoji: "🎲", kind: "self" },
  { id: "c37", title: "Wie schreibt man Gänsehaut-Gedichte? – Lyrik und moderne Dichtung", subjectWeights: { Deutsch: 0.8, Kunst: 0.2 }, split: "train", emoji: "📝", kind: "self" },
  { id: "c38", title: "Wie funktioniert dein Körper innen drin? – Anatomie des Menschen", subjectWeights: { Biologie: 0.8, Chemie: 0.1 }, split: "train", emoji: "🫀", kind: "self" },
  { id: "c39", title: "Welche Experimente darfst du im Labor machen? – Chemie praktisch", subjectWeights: { Chemie: 0.9, Physik: 0.1 }, split: "train", emoji: "⚗️", kind: "self" },
  { id: "c40", title: "Wie lebten Ritter wirklich? – Mittelalter", subjectWeights: { Geschichte: 0.8, Geografie: 0.2 }, split: "train", emoji: "🏰", kind: "self" },
  { id: "c41", title: "Wie beeinflussen Medien deine Meinung? – Medien und Meinungsbildung", subjectWeights: { Politik: 0.6, Deutsch: 0.3, "Ethik/Philosophie": 0.2 }, split: "train", emoji: "📰", kind: "self" },
  { id: "c42", title: "Warum klingen Noten zusammen schön? – Musiktheorie", subjectWeights: { Musik: 0.9, Mathe: 0.1 }, split: "train", emoji: "🎼", kind: "self" },
  { id: "c43", title: "Wie entsteht eine Figur aus Stein? – Skulptur und Gestalten", subjectWeights: { Kunst: 0.9, Geschichte: 0.1 }, split: "train", emoji: "🗿", kind: "self" },
  { id: "c44", title: "Wie lernen Maschinen aus Beispielen? – Maschinelles Lernen", subjectWeights: { Informatik: 0.7, Mathe: 0.5 }, split: "train", emoji: "🧠", kind: "self" },
  { id: "c45", title: "Warum sehen wir Regenbögen? – Optik und Licht", subjectWeights: { Physik: 0.9, Mathe: 0.2 }, split: "train", emoji: "🔦", kind: "self" },
  { id: "c46", title: "Wieso ändert sich das Klima? – Wetter und Klimawandel", subjectWeights: { Geografie: 0.6, Physik: 0.3, Biologie: 0.2 }, split: "train", emoji: "⛅", kind: "self" },
  { id: "c47", title: "Was ist eigentlich gerecht? – Strafrecht basics", subjectWeights: { "Ethik/Philosophie": 0.5, Politik: 0.5 }, split: "train", emoji: "📜", kind: "self" },
  { id: "c48", title: "Wer bezahlt Straßen und Schulen? – Steuern und Sozialsystem", subjectWeights: { Wirtschaft: 0.7, Politik: 0.4 }, split: "train", emoji: "💶", kind: "self" },
  { id: "c49", title: "Was verraten dir Kurven über Veränderungen? – Differentialrechnung", subjectWeights: { Mathe: 0.95, Physik: 0.1 }, split: "train", emoji: "📈", kind: "self" },
  { id: "c50", title: "Wie schreiben Autorinnen spannende Romane? – Erzähltechniken", subjectWeights: { Deutsch: 0.8, Kunst: 0.2 }, split: "train", emoji: "📚", kind: "self" },
];

/** Test-Set: Kurse nur für den Feed (werden nicht in Duelle gezeigt). */
const TEST_COURSES: CourseRecord[] = [
  // Selbstlernkurse (blau)
  { id: "t1", title: "Wie beweist man, dass etwas immer gilt? – Logik und Beweise", subjectWeights: { Mathe: 0.9, "Ethik/Philosophie": 0.1 }, split: "test", emoji: "♟️", kind: "self" },
  { id: "t2", title: "Wie wird aus einer Idee eine Geschichte? – Kreatives Schreiben", subjectWeights: { Deutsch: 0.8, Kunst: 0.2 }, split: "test", emoji: "✍️", kind: "self" },
  { id: "t3", title: "Wer lebt in einem Wassertropfen? – Mikrobe und Mensch", subjectWeights: { Biologie: 0.8, Chemie: 0.2 }, split: "test", emoji: "🦠", kind: "self" },
  { id: "t4", title: "Was verrät dir das Periodensystem? – Stoffe verstehen", subjectWeights: { Chemie: 0.9, Physik: 0.1 }, split: "test", emoji: "🧪", kind: "self" },
  { id: "t5", title: "Warum war das 20. Jahrhundert so turbulent? – Weltgeschichte", subjectWeights: { Geschichte: 0.8, Politik: 0.3 }, split: "test", emoji: "🕊️", kind: "self" },
  { id: "t6", title: "Wie funktionieren Wahlen wirklich? – Parteien und Demokratie", subjectWeights: { Politik: 0.9, Wirtschaft: 0.1 }, split: "test", emoji: "🗳️", kind: "self" },
  { id: "t7", title: "Warum klingt Beethoven anders als Beyoncé? – Musikgeschichte", subjectWeights: { Musik: 0.8, Geschichte: 0.2 }, split: "test", emoji: "🎶", kind: "self" },
  { id: "t8", title: "Wie machst du aus Schnappschüssen Kunst? – Fotografie", subjectWeights: { Kunst: 0.9, Geschichte: 0.1 }, split: "test", emoji: "📷", kind: "self" },
  { id: "t9", title: "Wo wohnen eigentlich Daten? – Datenbanken und SQL", subjectWeights: { Informatik: 0.9, Mathe: 0.1 }, split: "test", emoji: "🗄️", kind: "self" },
  { id: "t10", title: "Warum klebt der Magnet am Kühlschrank? – Elektrizität und Magnetismus", subjectWeights: { Physik: 0.9, Mathe: 0.2 }, split: "test", emoji: "⚡", kind: "self" },
  { id: "t11", title: "Was unterscheidet Wüste und Regenwald? – Klimazonen", subjectWeights: { Geografie: 0.8, Biologie: 0.2 }, split: "test", emoji: "🌿", kind: "self" },
  { id: "t12", title: "Wann ist eine Strafe gerecht? – Recht und Ethik", subjectWeights: { "Ethik/Philosophie": 0.8, Politik: 0.2 }, split: "test", emoji: "⚖️", kind: "self" },
  { id: "t13", title: "Wie gründet man eine eigene Firma? – Startups entdecken", subjectWeights: { Wirtschaft: 0.8, Politik: 0.2 }, split: "test", emoji: "🚀", kind: "self" },
  { id: "t14", title: "Wie wahrscheinlich ist ein Sechser im Lotto? – Zufall verstehen", subjectWeights: { Mathe: 0.9, Wirtschaft: 0.1 }, split: "test", emoji: "🎲", kind: "self" },
  { id: "t15", title: "Wie entsteht eine Nachrichtensendung? – Journalistisches Schreiben", subjectWeights: { Deutsch: 0.7, Politik: 0.3 }, split: "test", emoji: "📰", kind: "self" },
  { id: "t16", title: "Wie schützt man bedrohte Tiere? – Ökologie und Artenschutz", subjectWeights: { Biologie: 0.7, Geografie: 0.3 }, split: "test", emoji: "🐼", kind: "self" },
  { id: "t17", title: "Warum ist Kohlenstoff so wichtig? – Organische Chemie", subjectWeights: { Chemie: 0.8, Biologie: 0.2 }, split: "test", emoji: "🧬", kind: "self" },
  { id: "t18", title: "Wie lebten Griechen und Römer? – Antike Kulturen", subjectWeights: { Geschichte: 0.8, "Ethik/Philosophie": 0.2 }, split: "test", emoji: "🏛️", kind: "self" },
  { id: "t19", title: "Wie lösen Länder Streit ohne Krieg? – Internationale Beziehungen", subjectWeights: { Politik: 0.7, Geografie: 0.3, Wirtschaft: 0.2 }, split: "test", emoji: "🌐", kind: "self" },
  { id: "t20", title: "Wie schreibt man einen Ohrwurm? – Songwriting", subjectWeights: { Musik: 0.7, Deutsch: 0.3 }, split: "test", emoji: "🎤", kind: "self" },
  { id: "t21", title: "Warum wirkt Schrift mal laut, mal leise? – Design und Typografie", subjectWeights: { Kunst: 0.7, Informatik: 0.2 }, split: "test", emoji: "🖍️", kind: "self" },
  { id: "t22", title: "Wie bleibst du im Internet sicher? – Verschlüsselung und Passwörter", subjectWeights: { Informatik: 0.7, "Ethik/Philosophie": 0.2 }, split: "test", emoji: "🔒", kind: "self" },
  { id: "t23", title: "Kann ein Teilchen an zwei Orten sein? – Quantenphysik", subjectWeights: { Physik: 0.9, Mathe: 0.3 }, split: "test", emoji: "✨", kind: "self" },
  { id: "t24", title: "Warum verlassen Menschen ihre Heimat? – Migration und Ungleichheit", subjectWeights: { Geografie: 0.5, Politik: 0.5, Wirtschaft: 0.2 }, split: "test", emoji: "🌍", kind: "self" },
  { id: "t25", title: "Wie frei bist du wirklich? – Freiheit und Verantwortung", subjectWeights: { "Ethik/Philosophie": 0.9, Politik: 0.1 }, split: "test", emoji: "🗽", kind: "self" },
  { id: "t26", title: "Was passiert mit deinem Taschengeld in der Bank? – Geld und Finanzmärkte", subjectWeights: { Wirtschaft: 0.8, Mathe: 0.2 }, split: "test", emoji: "💰", kind: "self" },
  { id: "t27", title: "Wie baut man ein perfektes Dreieck? – Geometrie und Raum", subjectWeights: { Mathe: 0.8, Kunst: 0.1 }, split: "test", emoji: "📐", kind: "self" },
  { id: "t28", title: "Wie gewinnst du eine Debatte? – Argumentieren lernen", subjectWeights: { Deutsch: 0.6, Politik: 0.5 }, split: "test", emoji: "💬", kind: "self" },
  { id: "t29", title: "Warum merken wir uns manche Dinge besser? – Verhalten und Lernen", subjectWeights: { Biologie: 0.5, "Ethik/Philosophie": 0.4 }, split: "test", emoji: "🧠", kind: "self" },
  { id: "t30", title: "Woher kommt unsere Energie? – Nachhaltige Lösungen", subjectWeights: { Physik: 0.4, Geografie: 0.4, Wirtschaft: 0.3 }, split: "test", emoji: "🔋", kind: "self" },
  { id: "t31", title: "Wie sehen Kurven unendlich weit weg aus? – Analysis und Grenzwerte", subjectWeights: { Mathe: 0.95, Physik: 0.1 }, split: "test", emoji: "📉", kind: "self" },
  { id: "t32", title: "Wie schreibst du einen starken Aufsatz? – Essay und Stil", subjectWeights: { Deutsch: 0.8, "Ethik/Philosophie": 0.2 }, split: "test", emoji: "📝", kind: "self" },
  { id: "t33", title: "Wie denkt dein Gehirn beim Lernen? – Neurobiologie", subjectWeights: { Biologie: 0.8, "Ethik/Philosophie": 0.2 }, split: "test", emoji: "🧠", kind: "self" },
  { id: "t34", title: "Wie reagieren Elemente miteinander? – Anorganische Chemie", subjectWeights: { Chemie: 0.9, Physik: 0.1 }, split: "test", emoji: "⚗️", kind: "self" },
  { id: "t35", title: "Warum veränderte die Industrialisierung alles? – Arbeit und Maschinen", subjectWeights: { Geschichte: 0.7, Wirtschaft: 0.4 }, split: "test", emoji: "🏭", kind: "self" },
  { id: "t36", title: "Wie funktioniert die EU eigentlich? – Institutionen und Politik", subjectWeights: { Politik: 0.8, Geografie: 0.2, Wirtschaft: 0.2 }, split: "test", emoji: "🇪🇺", kind: "self" },
  { id: "t37", title: "Warum klingt Jazz so frei? – Jazz und Improvisation", subjectWeights: { Musik: 0.9, Geschichte: 0.1 }, split: "test", emoji: "🎷", kind: "self" },
  { id: "t38", title: "Wie malst du mit Licht? – Digitale Kunst und Medien", subjectWeights: { Kunst: 0.7, Informatik: 0.4 }, split: "test", emoji: "💻", kind: "self" },
  { id: "t39", title: "Warum lieben Entwickler Git? – Versionskontrolle verstehen", subjectWeights: { Informatik: 0.9, Mathe: 0.05 }, split: "test", emoji: "🔧", kind: "self" },
  { id: "t40", title: "Warum kocht Wasser bei 100 °C? – Thermodynamik", subjectWeights: { Physik: 0.9, Chemie: 0.2 }, split: "test", emoji: "🔥", kind: "self" },
  { id: "t41", title: "Woher kommen Metalle und Rohstoffe? – Schätze der Erde", subjectWeights: { Geografie: 0.7, Wirtschaft: 0.3, Chemie: 0.1 }, split: "test", emoji: "⛏️", kind: "self" },
  { id: "t42", title: "Was ist das größte Glück für alle? – Utilitarismus", subjectWeights: { "Ethik/Philosophie": 0.95, Politik: 0.1 }, split: "test", emoji: "🤝", kind: "self" },
  { id: "t43", title: "Warum willst du genau dieses Spielzeug? – Marketing verstehen", subjectWeights: { Wirtschaft: 0.8, Politik: 0.1 }, split: "test", emoji: "📣", kind: "self" },
  { id: "t44", title: "Wie bewegen sich Vektoren im Raum? – Lineare Algebra", subjectWeights: { Mathe: 0.95, Informatik: 0.1 }, split: "test", emoji: "📐", kind: "self" },
  { id: "t45", title: "Wie findest du deinen eigenen Schreibstil? – Kreative Schreibwerkstatt", subjectWeights: { Deutsch: 0.9, Kunst: 0.2 }, split: "test", emoji: "✒️", kind: "self" },

  // Live-Kurse (gold, Menschen-Emojis)
  { id: "t46", title: "Wie denken Maschinen? – Fragerunde mit KI-Experte Andy", subjectWeights: { Informatik: 0.7, Mathe: 0.3, "Ethik/Philosophie": 0.2 }, split: "test", emoji: "🤖", kind: "live", liveInfo: { time: "Heute, 17:00 Uhr", experts: ["Andy (KI-Experte)"] } },
  { id: "t47", title: "Können Roboter Gefühle haben? – Talk mit Dr. Lila", subjectWeights: { Informatik: 0.6, "Ethik/Philosophie": 0.5 }, split: "test", emoji: "🤖", kind: "live", liveInfo: { time: "Heute, 18:30 Uhr", experts: ["Dr. Lila (Robotik)"] } },
  { id: "t48", title: "Was macht ein Regenwurm unter der Erde? – Live mit Biologe Tom", subjectWeights: { Biologie: 0.9, Geografie: 0.2 }, split: "test", emoji: "🪱", kind: "live", liveInfo: { time: "Morgen, 16:00 Uhr", experts: ["Tom (Bodenbiologe)"] } },
  { id: "t49", title: "Warum leuchten Sterne? – Frag eine Astrophysikerin", subjectWeights: { Physik: 0.9, Mathe: 0.2 }, split: "test", emoji: "⭐", kind: "live", liveInfo: { time: "Morgen, 19:00 Uhr", experts: ["Dr. Sara (Astrophysik)"] } },
  { id: "t50", title: "Wie wird man Spiele-Entwickler? – Q&A mit Game-Designer Ben", subjectWeights: { Informatik: 0.8, Kunst: 0.3 }, split: "test", emoji: "🎮", kind: "live", liveInfo: { time: "Freitag, 17:30 Uhr", experts: ["Ben (Game-Designer)"] } },
  { id: "t51", title: "Wie entstehen Comics? – Zeichnen live mit Künstlerin Mei", subjectWeights: { Kunst: 0.9, Deutsch: 0.3 }, split: "test", emoji: "🎨", kind: "live", liveInfo: { time: "Freitag, 15:00 Uhr", experts: ["Mei (Comic-Zeichnerin)"] } },
  { id: "t52", title: "Warum brauchen wir Gesetze? – Gespräch mit Richter Jonas", subjectWeights: { Politik: 0.7, "Ethik/Philosophie": 0.6 }, split: "test", emoji: "⚖️", kind: "live", liveInfo: { time: "Samstag, 11:00 Uhr", experts: ["Richter Jonas"] } },
  { id: "t53", title: "Was passiert im Krankenhauslabor? – Live aus dem Mikroskopraum", subjectWeights: { Biologie: 0.8, Chemie: 0.4 }, split: "test", emoji: "🔬", kind: "live", liveInfo: { time: "Samstag, 14:30 Uhr", experts: ["Dr. Nia (Laborärztin)"] } },
  { id: "t54", title: "Wie klingen Orchester von innen? – Fragerunde mit Dirigentin Amira", subjectWeights: { Musik: 0.9, Geschichte: 0.2 }, split: "test", emoji: "🎤", kind: "live", liveInfo: { time: "Sonntag, 18:00 Uhr", experts: ["Amira (Dirigentin)"] } },
  { id: "t55", title: "Wer entscheidet über unser Geld? – Talk mit Finanzexpertin Lea", subjectWeights: { Wirtschaft: 0.9, Politik: 0.3 }, split: "test", emoji: "💰", kind: "live", liveInfo: { time: "Montag, 17:00 Uhr", experts: ["Lea (Finanzexpertin)"] } },
  { id: "t56", title: "Wie reist man als Forschungsreisende? – Live aus dem Regenwald", subjectWeights: { Geografie: 0.9, Biologie: 0.4 }, split: "test", emoji: "🔬", kind: "live", liveInfo: { time: "Dienstag, 16:00 Uhr", experts: ["Dr. Luis (Forscher)"] } },
  { id: "t57", title: "Wie schreibt man ein Kinderbuch? – Workshop mit Autorin Jana", subjectWeights: { Deutsch: 0.9, Kunst: 0.3 }, split: "test", emoji: "📖", kind: "live", liveInfo: { time: "Dienstag, 18:00 Uhr", experts: ["Jana (Autorin)"] } },
  { id: "t58", title: "Was machen Meeresbiologen den ganzen Tag? – Frag Dr. Finn", subjectWeights: { Biologie: 0.9, Geografie: 0.3 }, split: "test", emoji: "🐋", kind: "live", liveInfo: { time: "Mittwoch, 15:30 Uhr", experts: ["Dr. Finn (Meeresbiologe)"] } },
  { id: "t59", title: "Wie schützt man verfolgte Menschen? – Live mit Anwältin Samira", subjectWeights: { Politik: 0.7, "Ethik/Philosophie": 0.7 }, split: "test", emoji: "⚖️", kind: "live", liveInfo: { time: "Mittwoch, 19:00 Uhr", experts: ["Samira (Menschenrechtsanwältin)"] } },
  { id: "t60", title: "Kann man mit Mathe Zaubertricks erklären? – Show mit Prof. Leo", subjectWeights: { Mathe: 0.95, Physik: 0.2 }, split: "test", emoji: "🧮", kind: "live", liveInfo: { time: "Donnerstag, 17:30 Uhr", experts: ["Prof. Leo (Mathematiker)"] } },
  { id: "t61", title: "Wie wird ein Lied im Studio aufgenommen? – Live mit Produzentin Kim", subjectWeights: { Musik: 0.9, Informatik: 0.3 }, split: "test", emoji: "🎧", kind: "live", liveInfo: { time: "Donnerstag, 18:30 Uhr", experts: ["Kim (Musikproduzentin)"] } },
  { id: "t62", title: "Wie plant man eine Stadt für Kinder? – Gespräch mit Stadtplaner-Team", subjectWeights: { Geografie: 0.7, Politik: 0.6, Wirtschaft: 0.3 }, split: "test", emoji: "🏙️", kind: "live", liveInfo: { time: "Freitag, 16:00 Uhr", experts: ["Mara (Architektin)", "Jan (Stadtplaner)"] } },
  { id: "t63", title: "Was macht eine Klimaforscherin? – Frag Dr. Noor", subjectWeights: { Geografie: 0.8, Physik: 0.5, Biologie: 0.3 }, split: "test", emoji: "🌡️", kind: "live", liveInfo: { time: "Samstag, 10:30 Uhr", experts: ["Dr. Noor (Klimaforschung)"] } },
  { id: "t64", title: "Wie erfindet man ein neues Spielzeug? – Ideenschmiede mit Designer Alex", subjectWeights: { Kunst: 0.7, Wirtschaft: 0.4 }, split: "test", emoji: "🎨", kind: "live", liveInfo: { time: "Samstag, 13:00 Uhr", experts: ["Alex (Produktdesigner)"] } },
  { id: "t65", title: "Kann man Tiere vor Kamera scheu machen? – Live mit Tierfilmerin Zoe", subjectWeights: { Biologie: 0.7, Kunst: 0.4, Geografie: 0.3 }, split: "test", emoji: "🎬", kind: "live", liveInfo: { time: "Sonntag, 16:00 Uhr", experts: ["Zoe (Tierfilmerin)"] } },
  { id: "t66", title: "Wie sieht ein Gerichtssaal aus? – Rundgang mit Richter & Staatsanwältin", subjectWeights: { Politik: 0.7, "Ethik/Philosophie": 0.6 }, split: "test", emoji: "⚖️", kind: "live", liveInfo: { time: "Montag, 15:30 Uhr", experts: ["Richter Paul", "Staatsanwältin Iris"] } },
  { id: "t67", title: "Wie wird man Influencer für Wissenschaft? – Talk mit Science-Tuberin Leni", subjectWeights: { Informatik: 0.5, Deutsch: 0.6 }, split: "test", emoji: "💻", kind: "live", liveInfo: { time: "Montag, 19:00 Uhr", experts: ["Leni (Science-YouTuberin)"] } },
  { id: "t68", title: "Warum fallen Flugzeuge nicht runter? – Fragerunde mit Pilotin Mara", subjectWeights: { Physik: 0.8, Geografie: 0.4 }, split: "test", emoji: "✈️", kind: "live", liveInfo: { time: "Dienstag, 17:00 Uhr", experts: ["Mara (Pilotin)"] } },
  { id: "t69", title: "Wie macht man Nachrichten für Kinder? – Live aus der Redaktion", subjectWeights: { Deutsch: 0.8, Politik: 0.4 }, split: "test", emoji: "📰", kind: "live", liveInfo: { time: "Mittwoch, 18:00 Uhr", experts: ["Team der Kinderredaktion"] } },
  { id: "t70", title: "Was ist ein Hackathon? – Gespräch mit Programmiererinnen", subjectWeights: { Informatik: 0.9, Mathe: 0.2 }, split: "test", emoji: "💻", kind: "live", liveInfo: { time: "Donnerstag, 16:30 Uhr", experts: ["Mia (Programmiererin)", "Elif (Programmiererin)"] } },
  { id: "t71", title: "Wie hilft Musik beim Lernen? – Q&A mit Lerncoach Jonas", subjectWeights: { Musik: 0.6, Biologie: 0.4 }, split: "test", emoji: "🎵", kind: "live", liveInfo: { time: "Freitag, 18:00 Uhr", experts: ["Jonas (Lerncoach)"] } },
  { id: "t72", title: "Kann man mit Comics Politik erklären? – Live mit Cartoonistin Pia", subjectWeights: { Kunst: 0.7, Politik: 0.4 }, split: "test", emoji: "🎨", kind: "live", liveInfo: { time: "Samstag, 17:00 Uhr", experts: ["Pia (Cartoonistin)"] } },
  { id: "t73", title: "Wie wird man Tierärztin? – Fragerunde in der Praxis", subjectWeights: { Biologie: 0.9, Chemie: 0.3 }, split: "test", emoji: "🐕", kind: "live", liveInfo: { time: "Sonntag, 11:00 Uhr", experts: ["Dr. Nele (Tierärztin)"] } },
  { id: "t74", title: "Wie planen Forscher eine Expedition? – Live mit Polarteam", subjectWeights: { Geografie: 0.9, Physik: 0.3 }, split: "test", emoji: "🧊", kind: "live", liveInfo: { time: "Sonntag, 19:30 Uhr", experts: ["Team Polarlicht"] } },
  { id: "t75", title: "Kann man mit Spielen Mathe lernen? – Talk mit Edu-Game-Designer Duo", subjectWeights: { Mathe: 0.8, Informatik: 0.5, Kunst: 0.3 }, split: "test", emoji: "🎮", kind: "live", liveInfo: { time: "Montag, 16:30 Uhr", experts: ["Rico (Game-Designer)", "Lara (Pädagogin)"] } },

  // Projekt-Abenteuer (grün)
  { id: "t76", title: "Abenteuer Terrarium: Wir bauen ein Biotop!", subjectWeights: { Biologie: 0.8, Geografie: 0.4 }, split: "test", emoji: "🪴", kind: "project", projectInfo: { startDate: "05.04.", taken: 3, total: 6 } },
  { id: "t77", title: "Unsere Klassen-Zeitung: Nachrichten aus deiner Welt", subjectWeights: { Deutsch: 0.8, Politik: 0.3 }, split: "test", emoji: "📰", kind: "project", projectInfo: { startDate: "08.04.", taken: 2, total: 8 } },
  { id: "t78", title: "Mini-Solarpark: Wir bauen Solarmodelle", subjectWeights: { Physik: 0.8, Geografie: 0.3 }, split: "test", emoji: "☀️", kind: "project", projectInfo: { startDate: "10.04.", taken: 4, total: 6 } },
  { id: "t79", title: "Stadt der Zukunft: Plane dein Traumviertel", subjectWeights: { Geografie: 0.7, Politik: 0.4, Kunst: 0.3 }, split: "test", emoji: "🏙️", kind: "project", projectInfo: { startDate: "12.04.", taken: 1, total: 6 } },
  { id: "t80", title: "Podcast-Studio: Wir machen unseren eigenen Lern-Podcast", subjectWeights: { Deutsch: 0.8, Musik: 0.4 }, split: "test", emoji: "🎙️", kind: "project", projectInfo: { startDate: "15.04.", taken: 5, total: 8 } },
  { id: "t81", title: "Geschichtenlabor: Schreibe und illustriere dein eigenes Buch", subjectWeights: { Deutsch: 0.9, Kunst: 0.4 }, split: "test", emoji: "📚", kind: "project", projectInfo: { startDate: "18.04.", taken: 3, total: 6 } },
  { id: "t82", title: "Klima-Detektive: Wir messen unsere CO₂-Spuren", subjectWeights: { Geografie: 0.7, Biologie: 0.4, Politik: 0.3 }, split: "test", emoji: "🌍", kind: "project", projectInfo: { startDate: "20.04.", taken: 2, total: 6 } },
  { id: "t83", title: "Code-Quest: Baue dein erstes eigenes Minigame", subjectWeights: { Informatik: 0.9, Mathe: 0.3 }, split: "test", emoji: "🕹️", kind: "project", projectInfo: { startDate: "22.04.", taken: 3, total: 6 } },
  { id: "t84", title: "Musik aus Alltagsgeräuschen: Wir machen einen Soundtrack", subjectWeights: { Musik: 0.9, Kunst: 0.3 }, split: "test", emoji: "🎧", kind: "project", projectInfo: { startDate: "24.04.", taken: 4, total: 6 } },
  { id: "t85", title: "Schul-Gartenlabor: Wir planen Beete für Bienen & Co.", subjectWeights: { Biologie: 0.8, Geografie: 0.4 }, split: "test", emoji: "🌸", kind: "project", projectInfo: { startDate: "26.04.", taken: 2, total: 6 } },
  { id: "t86", title: "Mathe im Escape Room: Rätsel selber bauen", subjectWeights: { Mathe: 0.9, Informatik: 0.3 }, split: "test", emoji: "🧩", kind: "project", projectInfo: { startDate: "28.04.", taken: 1, total: 6 } },
  { id: "t87", title: "Wir bauen ein Mini-Museum: Geschichte zum Anfassen", subjectWeights: { Geschichte: 0.9, Kunst: 0.3 }, split: "test", emoji: "🏺", kind: "project", projectInfo: { startDate: "30.04.", taken: 4, total: 8 } },
  { id: "t88", title: "Programmierwerkstatt: Roboter mit Blöcken steuern", subjectWeights: { Informatik: 0.8, Mathe: 0.4 }, split: "test", emoji: "🤖", kind: "project", projectInfo: { startDate: "02.05.", taken: 3, total: 6 } },
  { id: "t89", title: "Wir planen einen fairen Schulkiosk", subjectWeights: { Wirtschaft: 0.8, Politik: 0.3 }, split: "test", emoji: "🍎", kind: "project", projectInfo: { startDate: "04.05.", taken: 5, total: 8 } },
  { id: "t90", title: "Kunst im Schulhof: Street-Art legal gestalten", subjectWeights: { Kunst: 0.9, Politik: 0.2 }, split: "test", emoji: "🎨", kind: "project", projectInfo: { startDate: "06.05.", taken: 2, total: 6 } },
  { id: "t91", title: "Wir entwickeln ein Klassen-Maskottchen", subjectWeights: { Kunst: 0.7, Deutsch: 0.3 }, split: "test", emoji: "🦊", kind: "project", projectInfo: { startDate: "08.05.", taken: 1, total: 6 } },
  { id: "t92", title: "Mini-Filmstudio: Drehe deinen eigenen Kurzfilm", subjectWeights: { Kunst: 0.8, Deutsch: 0.4 }, split: "test", emoji: "🎬", kind: "project", projectInfo: { startDate: "10.05.", taken: 4, total: 6 } },
  { id: "t93", title: "Wetterstation auf dem Schulhof: Wir sammeln Daten", subjectWeights: { Physik: 0.7, Geografie: 0.5 }, split: "test", emoji: "🌦️", kind: "project", projectInfo: { startDate: "12.05.", taken: 3, total: 6 } },
  { id: "t94", title: "Fair-Trade-Detektive: Woher kommen unsere Produkte?", subjectWeights: { Wirtschaft: 0.7, Geografie: 0.4, Politik: 0.3 }, split: "test", emoji: "🛒", kind: "project", projectInfo: { startDate: "14.05.", taken: 2, total: 6 } },
  { id: "t95", title: "Wir bauen eine Brücke aus Spaghetti", subjectWeights: { Physik: 0.8, Mathe: 0.5 }, split: "test", emoji: "🌉", kind: "project", projectInfo: { startDate: "16.05.", taken: 5, total: 8 } },
  { id: "t96", title: "Entdecker-Club: Erkunde deinen Lieblingsstern im All", subjectWeights: { Physik: 0.8, Geografie: 0.3 }, split: "test", emoji: "⭐", kind: "project", projectInfo: { startDate: "18.05.", taken: 3, total: 6 } },
  { id: "t97", title: "Mathe im Park: Wir vermessen unsere Umgebung", subjectWeights: { Mathe: 0.9, Geografie: 0.3 }, split: "test", emoji: "📏", kind: "project", projectInfo: { startDate: "20.05.", taken: 2, total: 6 } },
  { id: "t98", title: "Bau dir dein Traumklassenzimmer im Modell", subjectWeights: { Kunst: 0.8, Mathe: 0.3 }, split: "test", emoji: "🏫", kind: "project", projectInfo: { startDate: "22.05.", taken: 4, total: 6 } },
  { id: "t99", title: "Wir programmieren einen Klassen-Chatbot", subjectWeights: { Informatik: 0.9, Deutsch: 0.4 }, split: "test", emoji: "🤖", kind: "project", projectInfo: { startDate: "24.05.", taken: 3, total: 6 } },
  { id: "t100", title: "Unser eigener Markt: Wir erfinden Produkte & Preise", subjectWeights: { Wirtschaft: 0.9, Mathe: 0.4 }, split: "test", emoji: "🏪", kind: "project", projectInfo: { startDate: "26.05.", taken: 1, total: 6 } },
  { id: "t101", title: "Klanglabor: Wir bauen Instrumente aus Alltagsdingen", subjectWeights: { Musik: 0.9, Physik: 0.3 }, split: "test", emoji: "🥁", kind: "project", projectInfo: { startDate: "28.05.", taken: 4, total: 6 } },
  { id: "t102", title: "Freundschaft weltweit: Wir gestalten eine Länderwand", subjectWeights: { Geografie: 0.8, Geschichte: 0.3 }, split: "test", emoji: "🌎", kind: "project", projectInfo: { startDate: "30.05.", taken: 2, total: 6 } },
  { id: "t103", title: "Wir gründen eine Mini-Umwelt-AG", subjectWeights: { Politik: 0.6, Biologie: 0.5, Geografie: 0.4 }, split: "test", emoji: "🌳", kind: "project", projectInfo: { startDate: "01.06.", taken: 3, total: 6 } },
  { id: "t104", title: "Schulhof-Architekten: Wir planen neue Spielbereiche", subjectWeights: { Kunst: 0.7, Geografie: 0.4 }, split: "test", emoji: "🏗️", kind: "project", projectInfo: { startDate: "03.06.", taken: 5, total: 8 } },
  { id: "t105", title: "Wissenschaftsmesse: Wir bereiten unsere eigenen Experimente vor", subjectWeights: { Physik: 0.7, Chemie: 0.7, Biologie: 0.5 }, split: "test", emoji: "🧪", kind: "project", projectInfo: { startDate: "05.06.", taken: 4, total: 6 } },
];

/** Alle Kurse (train + test). */
export const COURSES: CourseRecord[] = [...TRAIN_COURSES, ...TEST_COURSES];

/** Nur Train-Kurse – für Duelle. */
export function getTrainCourses(): CourseRecord[] {
  return TRAIN_COURSES;
}

/** Nur Test-Kurse – für den Feed. */
export function getTestCourses(): CourseRecord[] {
  return TEST_COURSES;
}