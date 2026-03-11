import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SubjectWeights = Record<string, number>;

const trainCourses: { title: string; subjectWeights: SubjectWeights }[] = [
  { title: "Die Mathematik der Demokratie", subjectWeights: { Mathe: 0.4, Politik: 0.5, Geschichte: 0.2 } },
  { title: "Woher kommt eigentlich Honig? Ein Einblick in die Imkerei", subjectWeights: { Biologie: 0.7, Chemie: 0.2 } },
  { title: "Von der Keilschrift zum Emoji – Geschichte der Schrift", subjectWeights: { Deutsch: 0.5, Geschichte: 0.6, Kunst: 0.2 } },
  { title: "Klima und Kontinente – Geografie der Erde", subjectWeights: { Geografie: 0.8, Physik: 0.2, Politik: 0.2 } },
  { title: "Algorithmen im Alltag – Wie Apps uns lenken", subjectWeights: { Informatik: 0.6, "Ethik/Philosophie": 0.4, Wirtschaft: 0.2 } },
  { title: "Moleküle und Medizin – Chemie des Lebens", subjectWeights: { Chemie: 0.7, Biologie: 0.5 } },
  { title: "Revolutionen und ihre Folgen", subjectWeights: { Geschichte: 0.8, Politik: 0.5, "Ethik/Philosophie": 0.2 } },
  { title: "Musik und Mathematik – Harmonielehre verstehen", subjectWeights: { Musik: 0.6, Mathe: 0.5 } },
  { title: "Wirtschaft fair gestalten – Märkte und Moral", subjectWeights: { Wirtschaft: 0.6, "Ethik/Philosophie": 0.5, Politik: 0.3 } },
  { title: "Künstliche Intelligenz – Grundlagen und Grenzen", subjectWeights: { Informatik: 0.7, Mathe: 0.3, "Ethik/Philosophie": 0.3 } },
  { title: "Literatur der Romantik – Träume und Nachtseiten", subjectWeights: { Deutsch: 0.8, Kunst: 0.2, Geschichte: 0.2 } },
  { title: "Ökosysteme im Wandel – Biologie und Umwelt", subjectWeights: { Biologie: 0.7, Geografie: 0.3, Chemie: 0.2 } },
  { title: "Staat und Macht – Einführung in die Politikwissenschaft", subjectWeights: { Politik: 0.8, Geschichte: 0.4, Wirtschaft: 0.2 } },
  { title: "Zeichnen und Perspektive – Raum auf dem Papier", subjectWeights: { Kunst: 0.7, Mathe: 0.3 } },
  { title: "Vom Urknall zu den Sternen – Astrophysik für Einsteiger", subjectWeights: { Physik: 0.8, Mathe: 0.3 } },
  { title: "Sprachen der Welt – Wie Grammatik funktioniert", subjectWeights: { Deutsch: 0.6, "Ethik/Philosophie": 0.2 } },
  { title: "Gift und Gegengift – Chemie der Arzneimittel", subjectWeights: { Chemie: 0.7, Biologie: 0.4 } },
  { title: "Städte und Gesellschaft – Urbanistik", subjectWeights: { Geografie: 0.5, Politik: 0.4, Wirtschaft: 0.3 } },
  { title: "Programmieren mit Python – Dein erster Code", subjectWeights: { Informatik: 0.9, Mathe: 0.2 } },
  { title: "Philosophie des Glücks – Von Epikur bis heute", subjectWeights: { "Ethik/Philosophie": 0.9, Geschichte: 0.2 } },
  { title: "Bewegung und Kräfte – Mechanik verstehen", subjectWeights: { Physik: 0.8, Mathe: 0.4 } },
  { title: "Rhetorik und Überzeugung – Reden wie die Großen", subjectWeights: { Deutsch: 0.6, Politik: 0.4 } },
  { title: "Evolution und Verhalten – Was uns prägt", subjectWeights: { Biologie: 0.8, "Ethik/Philosophie": 0.2 } },
  { title: "Börse und Unternehmen – Wirtschaft zum Mitdenken", subjectWeights: { Wirtschaft: 0.8, Mathe: 0.2, Politik: 0.2 } },
  { title: "Farben und Formen – Einführung in die Malerei", subjectWeights: { Kunst: 0.8, Chemie: 0.1 } },
  { title: "Komponieren am Computer – Musik und Technik", subjectWeights: { Musik: 0.6, Informatik: 0.4 } },
  { title: "Kolonialismus und seine Folgen", subjectWeights: { Geschichte: 0.7, Geografie: 0.4, Politik: 0.4 } },
  { title: "Daten und Wahrheit – Statistik kritisch lesen", subjectWeights: { Mathe: 0.6, Politik: 0.3, Wirtschaft: 0.2 } },
  { title: "Nachhaltigkeit – Ökologie und Ökonomie", subjectWeights: { Wirtschaft: 0.4, Geografie: 0.4, Biologie: 0.3, Politik: 0.2 } },
  { title: "Ethik der Digitalisierung – Privatsphäre und Macht", subjectWeights: { "Ethik/Philosophie": 0.6, Informatik: 0.3, Politik: 0.3 } },
  { title: "Wellen und Schwingungen – Von Musik bis zum Handy", subjectWeights: { Physik: 0.6, Musik: 0.3, Mathe: 0.2 } },
  { title: "Mythos und Moderne – Antike in der Literatur", subjectWeights: { Deutsch: 0.6, Geschichte: 0.5, "Ethik/Philosophie": 0.2 } },
  { title: "Genetik und Gentechnik – Chancen und Risiken", subjectWeights: { Biologie: 0.7, Chemie: 0.3, "Ethik/Philosophie": 0.2 } },
  { title: "Webseiten bauen – HTML, CSS und ein bisschen JavaScript", subjectWeights: { Informatik: 0.7, Kunst: 0.2 } },
  { title: "Länder und Kulturen – Geografie Europas", subjectWeights: { Geografie: 0.7, Geschichte: 0.3 } },
  { title: "Spieltheorie – Entscheidungen und Strategien", subjectWeights: { Mathe: 0.6, Wirtschaft: 0.4, Politik: 0.2 } },
  { title: "Lyrik und moderne Dichtung", subjectWeights: { Deutsch: 0.8, Kunst: 0.2 } },
  { title: "Anatomie des Menschen – Körper und Gesundheit", subjectWeights: { Biologie: 0.8, Chemie: 0.1 } },
  { title: "Experimente und Labor – Chemie praktisch", subjectWeights: { Chemie: 0.9, Physik: 0.1 } },
  { title: "Mittelalter – Ritter, Klöster, Städte", subjectWeights: { Geschichte: 0.8, Geografie: 0.2 } },
  { title: "Medien und Meinungsbildung", subjectWeights: { Politik: 0.6, Deutsch: 0.3, "Ethik/Philosophie": 0.2 } },
  { title: "Musiktheorie – Noten und Harmonien", subjectWeights: { Musik: 0.9, Mathe: 0.1 } },
  { title: "Skulptur und dreidimensionales Gestalten", subjectWeights: { Kunst: 0.9, Geschichte: 0.1 } },
  { title: "Maschinelles Lernen – Grundideen", subjectWeights: { Informatik: 0.7, Mathe: 0.5 } },
  { title: "Optik und Licht", subjectWeights: { Physik: 0.9, Mathe: 0.2 } },
  { title: "Wetter und Klimawandel", subjectWeights: { Geografie: 0.6, Physik: 0.3, Biologie: 0.2 } },
  { title: "Recht und Unrecht – Strafrecht basics", subjectWeights: { "Ethik/Philosophie": 0.5, Politik: 0.5 } },
  { title: "Steuern und Sozialsystem", subjectWeights: { Wirtschaft: 0.7, Politik: 0.4 } },
  { title: "Differentialrechnung – Änderungsraten", subjectWeights: { Mathe: 0.95, Physik: 0.1 } },
  { title: "Erzähltechniken – Romane analysieren", subjectWeights: { Deutsch: 0.8, Kunst: 0.2 } },
];

const testCourses: { title: string; subjectWeights: SubjectWeights }[] = [
  { title: "Logik und Beweise – Einführung in die formale Mathematik", subjectWeights: { Mathe: 0.9, "Ethik/Philosophie": 0.1 } },
  { title: "Kreatives Schreiben – Von der Idee zum Text", subjectWeights: { Deutsch: 0.8, Kunst: 0.2 } },
  { title: "Mikroben und Menschen – Unsichtbare Lebenswelten", subjectWeights: { Biologie: 0.8, Chemie: 0.2 } },
  { title: "Periodensystem und Stoffe – Chemie verstehen", subjectWeights: { Chemie: 0.9, Physik: 0.1 } },
  { title: "Die Welt im 20. Jahrhundert", subjectWeights: { Geschichte: 0.8, Politik: 0.3 } },
  { title: "Wahlen und Parteien – Wie Demokratie funktioniert", subjectWeights: { Politik: 0.9, Wirtschaft: 0.1 } },
  { title: "Geschichte der Musik – Von Bach bis Beyoncé", subjectWeights: { Musik: 0.8, Geschichte: 0.2 } },
  { title: "Fotografie und Bildkomposition", subjectWeights: { Kunst: 0.9, Geschichte: 0.1 } },
  { title: "Datenbanken und SQL – Daten strukturiert speichern", subjectWeights: { Informatik: 0.9, Mathe: 0.1 } },
  { title: "Elektrizität und Magnetismus", subjectWeights: { Physik: 0.9, Mathe: 0.2 } },
  { title: "Klimazonen und Vegetation", subjectWeights: { Geografie: 0.8, Biologie: 0.2 } },
  { title: "Recht und Gerechtigkeit – Einführung in die Ethik", subjectWeights: { "Ethik/Philosophie": 0.8, Politik: 0.2 } },
  { title: "Startups und Unternehmensgründung", subjectWeights: { Wirtschaft: 0.8, Politik: 0.2 } },
  { title: "Wahrscheinlichkeit und Zufall", subjectWeights: { Mathe: 0.9, Wirtschaft: 0.1 } },
  { title: "Journalistisches Schreiben – Nachrichten und Berichte", subjectWeights: { Deutsch: 0.7, Politik: 0.3 } },
  { title: "Ökologie und Artenschutz", subjectWeights: { Biologie: 0.7, Geografie: 0.3 } },
  { title: "Organische Chemie – Kohlenstoffverbindungen", subjectWeights: { Chemie: 0.8, Biologie: 0.2 } },
  { title: "Antike Kulturen – Griechen und Römer", subjectWeights: { Geschichte: 0.8, "Ethik/Philosophie": 0.2 } },
  { title: "Internationale Beziehungen", subjectWeights: { Politik: 0.7, Geografie: 0.3, Wirtschaft: 0.2 } },
  { title: "Songwriting – Texte und Melodien", subjectWeights: { Musik: 0.7, Deutsch: 0.3 } },
  { title: "Design und Typografie", subjectWeights: { Kunst: 0.7, Informatik: 0.2 } },
  { title: "Sicherheit im Internet – Verschlüsselung und Passwörter", subjectWeights: { Informatik: 0.7, "Ethik/Philosophie": 0.2 } },
  { title: "Quantenphysik – Ein erster Einblick", subjectWeights: { Physik: 0.9, Mathe: 0.3 } },
  { title: "Migration und globale Ungleichheit", subjectWeights: { Geografie: 0.5, Politik: 0.5, Wirtschaft: 0.2 } },
  { title: "Freiheit und Verantwortung", subjectWeights: { "Ethik/Philosophie": 0.9, Politik: 0.1 } },
  { title: "Geld und Finanzmärkte", subjectWeights: { Wirtschaft: 0.8, Mathe: 0.2 } },
  { title: "Geometrie und Raumvorstellung", subjectWeights: { Mathe: 0.8, Kunst: 0.1 } },
  { title: "Debattieren und Argumentieren", subjectWeights: { Deutsch: 0.6, Politik: 0.5 } },
  { title: "Verhalten und Lernen – Psychologie und Biologie", subjectWeights: { Biologie: 0.5, "Ethik/Philosophie": 0.4 } },
  { title: "Energie und Nachhaltigkeit", subjectWeights: { Physik: 0.4, Geografie: 0.4, Wirtschaft: 0.3 } },
  { title: "Analysis – Funktionen und Grenzwerte", subjectWeights: { Mathe: 0.95, Physik: 0.1 } },
  { title: "Essay schreiben – Argumentation und Stil", subjectWeights: { Deutsch: 0.8, "Ethik/Philosophie": 0.2 } },
  { title: "Neurobiologie – Gehirn und Lernen", subjectWeights: { Biologie: 0.8, "Ethik/Philosophie": 0.2 } },
  { title: "Anorganische Chemie – Elemente und Reaktionen", subjectWeights: { Chemie: 0.9, Physik: 0.1 } },
  { title: "Industrialisierung und soziale Frage", subjectWeights: { Geschichte: 0.7, Wirtschaft: 0.4 } },
  { title: "Europäische Union – Institutionen und Politik", subjectWeights: { Politik: 0.8, Geografie: 0.2, Wirtschaft: 0.2 } },
  { title: "Jazz und Improvisation", subjectWeights: { Musik: 0.9, Geschichte: 0.1 } },
  { title: "Digitale Kunst und Medien", subjectWeights: { Kunst: 0.7, Informatik: 0.4 } },
  { title: "Versionskontrolle mit Git", subjectWeights: { Informatik: 0.9, Mathe: 0.05 } },
  { title: "Thermodynamik – Wärme und Energie", subjectWeights: { Physik: 0.9, Chemie: 0.2 } },
  { title: "Ressourcen und Rohstoffe der Erde", subjectWeights: { Geografie: 0.7, Wirtschaft: 0.3, Chemie: 0.1 } },
  { title: "Utilitarismus und Konsequenzethik", subjectWeights: { "Ethik/Philosophie": 0.95, Politik: 0.1 } },
  { title: "Marketing und Konsumentenverhalten", subjectWeights: { Wirtschaft: 0.8, Politik: 0.1 } },
  { title: "Lineare Algebra – Vektoren und Matrizen", subjectWeights: { Mathe: 0.95, Informatik: 0.1 } },
  { title: "Kreative Schreibwerkstatt", subjectWeights: { Deutsch: 0.9, Kunst: 0.2 } },
];

async function main() {
  await prisma.userProfile.deleteMany({});
  await prisma.choice.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.course.deleteMany({});

  for (const c of trainCourses) {
    await prisma.course.create({
      data: {
        title: c.title,
        subjectWeights: c.subjectWeights as object,
        split: "train",
      },
    });
  }
  for (const c of testCourses) {
    await prisma.course.create({
      data: {
        title: c.title,
        subjectWeights: c.subjectWeights as object,
        split: "test",
      },
    });
  }

  console.log(`Seeded ${trainCourses.length} train + ${testCourses.length} test = ${trainCourses.length + testCourses.length} courses.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
