import type { CmsAnimal } from '@shared/types/cms-types.ts';

export class SheltifyAccess {

  private readonly headers = {
    "Content-Type": "application/json",
  };

  public get apiBaseUrl() {
    const tenant = import.meta.env.TENANT;
    return `http://localhost:3000/api/${tenant}/`;
  }

  public get animals(): Promise<CmsAnimal[]> {
    return this.get<CmsAnimal[]>('animals')
  }

  public animalById(id: number): Promise<CmsAnimal> {
    return this.get<CmsAnimal>(`animals/${id}`)
  }

  public async get<T>(path: string) {
    console.log(this.apiBaseUrl)
    console.log(this.apiBaseUrl + path)
    const res = await fetch(this.apiBaseUrl + path, {
      headers: this.headers,
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data as T;
  }
}

export const cms = new SheltifyAccess();
