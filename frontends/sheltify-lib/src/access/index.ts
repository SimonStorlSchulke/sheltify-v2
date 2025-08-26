import type { Animal } from "src/types/animal";
import { StrapiAccess } from "src/access/strapi-access";
import type { AnimalArticle } from "src/types/animal-article";

export interface CmsAccess {
    get animals(): Promise<Animal[]>;
    animalArticleByName(animalName: string): Promise<AnimalArticle>;
}

export const cms: CmsAccess = new StrapiAccess();
