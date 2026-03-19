import { CmsAnimal } from 'cms-types';

export function animalsByArticleId(animals: CmsAnimal[]): Record<string, CmsAnimal[]> {
  return animals.reduce((acc, animal) => {
    animal.ArticleID ??= 'NoArticle'
    acc[animal.ArticleID] = acc[animal.ArticleID] ?? [];
    acc[animal.ArticleID].push(animal);
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
  return names.slice(0, -1).join(", ") + ` & ${names[names.length - 1]}`;
}