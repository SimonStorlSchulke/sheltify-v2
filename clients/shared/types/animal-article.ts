import type { Animal } from '@shared/types/animal.ts';
import type { ArticleSection } from '@shared/types/article.ts';

export type AnimalArticle = {
  title?: string;
  animals: Animal[];
  sections: ArticleSection[];
  preselectedAnimalId: number;
};1
