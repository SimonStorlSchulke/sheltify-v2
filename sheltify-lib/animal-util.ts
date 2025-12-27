import { CmsAnimal } from 'cms-types';

export function animalsByArticleId(animals: CmsAnimal[]): Record<string, CmsAnimal[]> {
  return animals.reduce((acc, animal) => {
    animal.ArticleID ??= 'NoArticle'
    acc[animal.ArticleID] = acc[animal.ArticleID] ?? [];
    acc[animal.ArticleID].push(animal);
    return acc;
  }, {} as Record<string, CmsAnimal[]>);
}