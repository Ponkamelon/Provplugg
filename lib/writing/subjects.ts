/**
 * Officiella ämnen för skrivövningar heter "Skrivklura <språk>" i
 * subjects-tabellen (jämför "Nationell <ämne>" för nationella prov).
 * Namnet används bara för att välja rätt märkning i listor — själva
 * övningarna känns igen på study_sets.set_type = 'skriv'.
 */
export function isWritingSubject(subjectName: string): boolean {
  return subjectName.toLowerCase().startsWith("skrivklura");
}
