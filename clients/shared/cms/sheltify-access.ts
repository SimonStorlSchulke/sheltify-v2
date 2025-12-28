import { type AnimalsFilter, type CmsArticle } from 'sheltify-lib/article-types.ts';
import type { CmsAnimal, CmsPage, CmsTenantConfiguration } from 'sheltify-lib/cms-types';

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
    return this.get<CmsPage[]>('pages');
  }

  public async getStaticPaths() {
    return (await this.getPages()).map(page => ({
      params: { path: page.Path }
    }));
  }

  public async getPageByPath(path: string): Promise<CmsPage> {
    return this.get<CmsPage>(`page-by-path?path=${path}`)
  }

  public async getArticle(id: string): Promise<CmsArticle> {
    return this.get<CmsArticle>(`article/${id}`)
  }

  public get tenantConfig(): Promise<CmsTenantConfiguration> {
    return this.get<CmsTenantConfiguration>('configuration');
  }

  public get animals(): Promise<CmsAnimal[]> {
    return this.get<CmsAnimal[]>('animals')
  }

  public getFilteredAnimals(filter: AnimalsFilter): Promise<CmsAnimal[]> {
    let query = ``;

    if(filter.AnimalKind) query += `kind=${filter.AnimalKind}&`;
    if(filter.MaxNumber) query += `maxNumber=${filter.MaxNumber}&`;
    if(filter.AgeRange[0]) query += `ageMin=${filter.AgeRange[0]}&`;
    if(filter.AgeRange[1]) query += `ageMax=${filter.AgeRange[1]}&`;
    if(filter.SizeRange[0]) query += `sizeMin=${filter.SizeRange[0]}&`;
    if(filter.SizeRange[1]) query += `sizeMax=${filter.SizeRange[1]}&`;
    if(filter.Gender != 'both') query += `gender=${filter.Gender}&`;

    return this.get<CmsAnimal[]>(`animals/filtered?${query}`);
  }

  public animalById(id: number): Promise<CmsAnimal> {
    return this.get<CmsAnimal>(`animals/${id}`)
  }

  private cache = new Map<string, unknown>();
  private isDev = import.meta.env.MY_ENV === 'dev';
  public async get<T>(path: string) {
    if(this.cache.has(path)) return this.cache.get(path) as T;
    const res = await fetch(this.apiBaseUrl + path, {
      headers: this.headers,
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    if(!this.isDev) {
      this.cache.set(path, data)
    }
    return data as T;
  }
}

export const cms = new SheltifyAccess(import.meta.env.TENANT);
