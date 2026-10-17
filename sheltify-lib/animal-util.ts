import { CmsAnimal, SqlNullTime } from 'cms-types';

export function animalsByArticleId(animals: CmsAnimal[]): Record<string, CmsAnimal[]> {
  return animals.reduce((acc, animal) => {
    const key = animal.ArticleID ?? 'NoArticle'
    acc[key] = acc[key] ?? [];
    acc[key].push(animal);
    return acc;
  }, {} as Record<string, CmsAnimal[]>);
}

export function removeDuplicateAnimalsByArticleId(animals: CmsAnimal[]): CmsAnimal[] {
  const seen = new Set<string | number>();

  return animals.filter(animal => {
    if(!animal.ArticleID) return false;
    if (seen.has(animal.ArticleID)) {
      return false;
    }
    seen.add(animal.ArticleID);
    return true;
  });
}

export function getMultiAnimalTitle(animals: CmsAnimal[]): string {
  const names = animals.map(animal => animal.Name) ?? [];
  if (names.length == 1) {
    return names[0];
  }
  if (names.length == 2) {
    return `${names[0]} & ${names[1]}`;
  }
  return names.slice(0, -1).join(", ") + ` & ${names.at(-1)}`;
}

export function isAnimalHomeFoundBetween(
  animal: CmsAnimal,
  dateFrom: SqlNullTime,
  dateTo: SqlNullTime,
) {
  if (animal.HomeFoundStatus !== 'yes') return false;

  const homeFoundAt = new Date(animal.HomeFoundAt.Time!);
  const fromValid = dateFrom?.Valid ? new Date(dateFrom.Time!) : null;
  const toValid = dateTo?.Valid ? new Date(dateTo.Time!) : null;

  return (!fromValid || homeFoundAt >= fromValid) && (!toValid || homeFoundAt <= toValid);
}