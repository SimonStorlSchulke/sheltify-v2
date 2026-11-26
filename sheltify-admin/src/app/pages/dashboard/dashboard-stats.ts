import { CmsAnimal, CmsFormSubmission } from 'sheltify-lib/cms-types';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Animals not touched for this many days are flagged as "stale" on the dashboard. */
export const STALE_AFTER_DAYS = 180;
/** Reservations older than this many days are flagged on the dashboard. */
export const LONG_RESERVED_AFTER_DAYS = 60;

export type AnimalStats = {
  total: number;
  available: number;
  published: number;
  drafts: number;
  reserved: number;
  homeFoundThisYear: number;
  homeFoundLastYear: number;
  patronsNeeded: number;
};

export type CountEntry = { label: string; count: number };

export type AttentionItem = {
  key: string;
  label: string;
  hint: string;
  animals: CmsAnimal[];
};

export function isAnimalPublished(animal: CmsAnimal): boolean {
  return !!animal.PublishedAt?.Valid && !!animal.ArticleID && animal.ArticleID !== 'NoArticle';
}

export function isHomeFound(animal: CmsAnimal): boolean {
  return animal.HomeFoundStatus === 'yes';
}

export function isFormUnread(form: CmsFormSubmission): boolean {
  return !form.LastModifiedBy;
}

function homeFoundYear(animal: CmsAnimal): number | undefined {
  if (!isHomeFound(animal) || !animal.HomeFoundAt?.Valid || !animal.HomeFoundAt.Time) return undefined;
  return new Date(animal.HomeFoundAt.Time).getFullYear();
}

function daysSince(date: string | Date | undefined | null, now: Date): number | undefined {
  if (!date) return undefined;
  const time = new Date(date).getTime();
  if (isNaN(time)) return undefined;
  return Math.floor((now.getTime() - time) / DAY_MS);
}

export function computeAnimalStats(animals: CmsAnimal[], now = new Date()): AnimalStats {
  const year = now.getFullYear();
  const notHomeFound = animals.filter(a => !isHomeFound(a));

  return {
    total: animals.length,
    available: notHomeFound.filter(a => a.HomeFoundStatus !== 'reserved').length,
    published: animals.filter(isAnimalPublished).length,
    drafts: notHomeFound.filter(a => !isAnimalPublished(a)).length,
    reserved: animals.filter(a => a.HomeFoundStatus === 'reserved').length,
    homeFoundThisYear: animals.filter(a => homeFoundYear(a) === year).length,
    homeFoundLastYear: animals.filter(a => homeFoundYear(a) === year - 1).length,
    patronsNeeded: notHomeFound.filter(a => a.PatronsNeeded).length,
  };
}

/** Animals that found a home, most recent first. */
export function recentHomeFound(animals: CmsAnimal[], amount: number): CmsAnimal[] {
  return animals
    .filter(a => isHomeFound(a) && a.HomeFoundAt?.Valid && a.HomeFoundAt.Time)
    .sort((a, b) => new Date(b.HomeFoundAt.Time!).getTime() - new Date(a.HomeFoundAt.Time!).getTime())
    .slice(0, amount);
}

/** Number of adoptions per year for the last `years` years (oldest first, current year last). */
export function homeFoundPerYear(animals: CmsAnimal[], years: number, now = new Date()): CountEntry[] {
  const currentYear = now.getFullYear();
  const result: CountEntry[] = [];
  for (let y = currentYear - years + 1; y <= currentYear; y++) {
    result.push({ label: String(y), count: animals.filter(a => homeFoundYear(a) === y).length });
  }
  return result;
}

/** Counts animals still in care (not home found) by a grouping key, sorted descending. */
export function countBy(animals: CmsAnimal[], keyFn: (a: CmsAnimal) => string[]): CountEntry[] {
  const counts = new Map<string, number>();
  for (const animal of animals) {
    for (const key of keyFn(animal)) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function countByKind(animals: CmsAnimal[], fallback = 'ohne Tierart'): CountEntry[] {
  return countBy(animals.filter(a => !isHomeFound(a)), a => [a.AnimalKind?.trim() || fallback]);
}

/** Counts by status; only stati configured for the tenant are considered (an animal can have several). */
export function countByStatus(animals: CmsAnimal[], configuredStati: string[]): CountEntry[] {
  const allowed = new Set(configuredStati.map(s => s.trim()).filter(Boolean));
  return countBy(
    animals.filter(a => !isHomeFound(a)),
    a => (a.Status ?? '').split(',').map(s => s.trim()).filter(s => allowed.has(s)),
  );
}

/** Things editors probably want to fix, only for animals still in care. Empty groups are omitted. */
export function computeAttentionItems(animals: CmsAnimal[], now = new Date()): AttentionItem[] {
  const inCare = animals.filter(a => !isHomeFound(a));
  const published = inCare.filter(isAnimalPublished);

  const items: AttentionItem[] = [
    {
      key: 'no-portrait',
      label: 'Veröffentlicht ohne Portrait',
      hint: 'Diese Tiere erscheinen auf der Website ohne Vorschaubild.',
      animals: published.filter(a => !a.PortraitID && !a.Portrait),
    },
    {
      key: 'no-description',
      label: 'Veröffentlicht ohne Beschreibung',
      hint: 'Eine kurze Beschreibung hilft bei der Vermittlung.',
      animals: published.filter(a => !a.Description?.trim()),
    },
    {
      key: 'unpublished',
      label: 'Nicht veröffentlicht',
      hint: 'Diese Tiere sind noch nicht auf der Website sichtbar (nicht veröffentlicht oder ohne Artikel).',
      animals: inCare.filter(a => !isAnimalPublished(a)),
    },
    {
      key: 'long-reserved',
      label: `Seit über ${LONG_RESERVED_AFTER_DAYS} Tagen reserviert`,
      hint: 'Ist die Vermittlung abgeschlossen? Dann den Status auf "Zuhause gefunden" setzen.',
      animals: inCare.filter(a => a.HomeFoundStatus === 'reserved'
        && (daysSince(a.UpdatedAt, now) ?? 0) > LONG_RESERVED_AFTER_DAYS),
    },
    {
      key: 'stale',
      label: `Seit über ${STALE_AFTER_DAYS} Tagen nicht aktualisiert`,
      hint: 'Ein aktuelles Foto oder Update hält das Profil interessant.',
      animals: published.filter(a => (daysSince(a.UpdatedAt, now) ?? 0) > STALE_AFTER_DAYS),
    },
  ];

  return items.filter(item => item.animals.length > 0);
}
