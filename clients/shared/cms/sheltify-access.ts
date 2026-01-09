import { type AnimalsFilter, type CmsArticle } from 'sheltify-lib/article-types.ts';
import { type CmsAnimal, type CmsImage, type CmsPage, type CmsTenantConfiguration } from 'sheltify-lib/cms-types';
import { filterPublishedAndHasArticle, sortByPriorityAndUpdatedAt } from 'sheltify-lib/cms-utils.ts';
import { animalsByArticleId } from 'sheltify-lib/animal-util.ts';
import type { SeoData } from '@shared/types/seo-data';

export class SheltifyAccess {

  constructor(private tenant: string) {}

  private readonly headers = {
    "Content-Type": "application/json",
  };

  public uploadsUrl = 'http://localhost:3000/api/uploads/' as const;

  public get apiBaseUrl() {
    return `http://localhost:3000/api/${this.tenant}/`;
  }

  public async getPages(): Promise<CmsPage[]> {
    return this.getSortedByPriorityAndUpdatedAt<CmsPage>('pages');
  }

  public async getStaticPathsPages() {
    return (await this.getPages()).map(page => ({
      params: { path: page.Path }
    }));
  }

  public async getStaticPathsAnimals() {
    const animals = await this.animals;
    animals.sort((a, b) => a.ID.localeCompare(b.ID));

    const animalsByArticle = animalsByArticleId(animals);

    const defaultAnimalKind = (await this.tenantConfig).DefaultAnimalKind;

    const paths = Object.entries(animalsByArticle).map(entry => {
      const animals = entry[1];
      const animalNames = animals.map(animal => animal.Name).join('-');

      return {params: {
          animalKind: animals[0].AnimalKind ?? defaultAnimalKind,
          animalNames: animalNames,
        }}
    })

    return paths;
  }

  public async getPageByPath(path: string): Promise<CmsPage> {
    return this.get<CmsPage>(`page-by-path?path=${path}`)
  }

  public async getSeoByPath(path: string): Promise<SeoData> {
    const page = await this.getPageByPath(path);
    const pathParts = path.split('/');
    const title = pathParts[pathParts.length - 1];

    return {
      title,
      description: page.Description,
    }
  }

  public async getArticle(id: string): Promise<CmsArticle> {
    return this.get<CmsArticle>(`article/${id}`)
  }

  public get tenantConfig(): Promise<CmsTenantConfiguration> {
    return this.get<CmsTenantConfiguration>('configuration');
  }

  public getMediaFilesByIds(ids: string[]): Promise<CmsImage[]> {
    return this.get<CmsImage[]>('media?ids=' + ids.join(','));
  }

  public get animals(): Promise<CmsAnimal[]> {
    return this.getSortedByPriorityAndUpdatedAt<CmsAnimal>('animals')
  }

  public async getFilteredAnimals(filter: AnimalsFilter): Promise<CmsAnimal[]> {
    let query = ``;

    if(filter.AnimalKind) query += `kind=${filter.AnimalKind}&`;
    if(filter.MaxNumber) query += `maxNumber=${filter.MaxNumber}&`;
    if(filter.AgeRange[0]) query += `ageMin=${filter.AgeRange[0]}&`;
    if(filter.AgeRange[1]) query += `ageMax=${filter.AgeRange[1]}&`;
    if(filter.SizeRange[0]) query += `sizeMin=${filter.SizeRange[0]}&`;
    if(filter.SizeRange[1]) query += `sizeMax=${filter.SizeRange[1]}&`;
    if(filter.Gender != 'both') query += `gender=${filter.Gender}&`;

    const animals = await this.get<CmsAnimal[]>(`animals/filtered?${query}`);
    return sortByPriorityAndUpdatedAt(filterPublishedAndHasArticle(animals));
  }

  public animalById(id: number): Promise<CmsAnimal> {
    return this.get<CmsAnimal>(`animals/${id}`)
  }

  public async getSortedByPriorityAndUpdatedAt<T extends { Priority: number; UpdatedAt?: string | Date | null}>(path: string) {
    const result = await this.get<T[]>(path);
    return sortByPriorityAndUpdatedAt(result);
  }

  private cache = new Map<string, unknown>();
  private isDev = import.meta.env.MY_ENV === 'dev';
  public async get<T>(path: string) {
    if(this.cache.has(path)) return this.cache.get(path) as T;
    const res = await fetch(this.apiBaseUrl + path, {
      headers: this.headers,
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    if(!this.isDev) {
      this.cache.set(path, data)
    }
    return data as T;
  }
}

export const cms = new SheltifyAccess(import.meta.env.TENANT);
