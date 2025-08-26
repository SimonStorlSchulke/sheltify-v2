import type { Animal } from "src/types/animal.ts";
import type { ArticleSection } from "src/types/article.ts";

export type AnimalArticle = {
  title?: string;
  animals: Animal[];
  sections: ArticleSection[];
  preselectedAnimalId: number;
};1
