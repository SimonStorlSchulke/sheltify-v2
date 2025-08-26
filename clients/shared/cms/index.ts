import { StrapiAccess } from '@shared/cms/strapi-access';
import type { AnimalArticle } from '@shared/types/animal-article';
import type { Animal } from '@shared/types/animal.ts';

export interface CmsAccess {
    get animals(): Promise<Animal[]>;
    animalArticleByName(animalName: string): Promise<AnimalArticle>;
}

export const cms: CmsAccess = new StrapiAccess();
