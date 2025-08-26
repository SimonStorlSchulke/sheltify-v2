import type { AnimalArticle } from "src/types/animal-article.ts";
import type { Animal } from "src/types/animal.ts";
import type { CmsAccess } from "src/access/index.ts";

export class StrapiAccess implements CmsAccess {

  private readonly bearer =
    "a54b3bdc5772ebdacff1a1b5b8176b6011421634344e42e42252b7895882016ad16cf0c5ecb4b1b8cef5cb4fd840e12e4d7cfe8d00571f070be27bc831c2f5d3ab9ba3b048d6cad8ff9070055d748b2409745b302119664d7d97b366aafe0a39486c090f1ddb1101d2c3e050874f0e97c6f25b60cfb80e8ec9d38775106e2289";
  
  private readonly apiBaseUrl = "https://cms.sheltify.de/api/";
  public static readonly uploadsBaseUrl = "https://cms.sheltify.de" as const;
  
  private readonly headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${this.bearer}`,
  };

  public  async get<T>(path: string) {
    const res = await fetch(this.apiBaseUrl + path, {
      headers: this.headers,
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return this.flattenStrapiObject(data) as T;
  }

  public get animals(): Promise<Animal[]> {
    return this.get<Animal[]>('animals?pagination[pageSize]=500&populate[thumbnail]=*&populate[animal_article]=updatedAt');
  }

  public async animalArticleByName(animalName: string): Promise<AnimalArticle> {
    const path = `animal-articles?filters[animals][name][$eqi]=${animalName}&populate[sections][populate]=*&populate[animals][populate][thumbnail]=*&populate[animals][populate][animalKind][populate][icon]=*`;
    const articles = await this.get<AnimalArticle[]>(path);
    return articles[0];
  }

  private flattenStrapiObject(data: any) {
  const isObject = (data: any) =>
    Object.prototype.toString.call(data) === "[object Object]";
  const isArray = (data: any) =>
    Object.prototype.toString.call(data) === "[object Array]";

  function flatten(data: any) {
    if (!data.attributes) return data;

    return {
      id: data.id,
      ...data.attributes,
    };
  }

  if (isArray(data)) {
    return data.map((item: any) => this.flattenStrapiObject(item));
  }

  if (isObject(data)) {
    if (isArray(data.data)) {
      data = [...data.data];
    } else if (isObject(data.data)) {
      data = flatten({ ...data.data });
    } else if (data.data === null) {
      data = null;
    } else {
      data = flatten(data);
    }

    for (const key in data) {
      data[key] = this.flattenStrapiObject(data[key]);
    }

    return data;
  }

  return data;
}
}
