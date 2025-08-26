import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { StrapiMedia, StrapiFilter } from '../types/types';
import { SheltifyAccessConfig } from './sheltify-access.config';

let showDrafts = false;

@Injectable({
  providedIn: 'root'
})
export class StrapiService {

  private static tenant: string;
  private static apiBaseUrl: string;
  private static uploadsBaseUrl: string;

  static headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${SheltifyAccessConfig.strapi.bearer}`,
  };

  constructor() {
    if (SheltifyAccessConfig.strapi.tenant == "") throw "SheltifyAccessConfig.strapi.tenant not set"
    if (SheltifyAccessConfig.strapi.baseUrl == "") throw "SheltifyAccessConfig.strapi.baseUrl not set"

    StrapiService.tenant = SheltifyAccessConfig.strapi.tenant;
    StrapiService.apiBaseUrl = `${SheltifyAccessConfig.strapi.baseUrl}/api/`;
    StrapiService.uploadsBaseUrl = SheltifyAccessConfig.strapi.baseUrl;
  }


  private httpClient = inject(HttpClient);

  public enableDrafts() {
    showDrafts = true;
  }


  public get<T>(path: string): Observable<T> {
    const tenantFilter = "&filters[createdBy][username][$eq]=hhg";
    let url = decodeURIComponent(StrapiService.apiBaseUrl + path);
    url = this.addDraftsInDevMode(url);
    return this.httpClient
      .get(url + `&filters[createdBy][username][$eq]=${StrapiService.tenant}`, {
        headers: StrapiService.headers,
      })
      .pipe(map((obj) => flattenStrapiObject(obj)));
  }

  public getWithMeta<DataT, MetaT>(path: string): Observable<[DataT, MetaT]> {
    let url = decodeURIComponent(StrapiService.apiBaseUrl + path);
    url = this.addDraftsInDevMode(url);
    return this.httpClient
      .get(url + `&filters[createdBy][username][$eq]=${StrapiService.tenant}`, {
        headers: StrapiService.headers,
      })
      .pipe(
        map((obj) => {
          const meta = (obj as any)["meta"];
          return [flattenStrapiObject(obj), meta]
        }));
  }

  public getAsString(path: string, filters: StrapiFilter[] = []): Observable<string> {
    let params = new URLSearchParams();

    for (const filter of filters) {
      params.append(
        `filters[${filter.field}][$${filter.operator ?? 'eq'}]`,
        filter.value,
      );
    }
    let url =
      StrapiService.apiBaseUrl +
      path +
      (path.includes('?') ? '&' : '?') +
      params.toString();
    url = this.addDraftsInDevMode(url);

    return this.httpClient
      .get(decodeURIComponent(url), { headers: StrapiService.headers })
      .pipe(map((obj) => JSON.stringify(flattenStrapiObject(obj))));
  }

  public getVideoUrl(media: StrapiMedia) {
    return StrapiService.uploadsBaseUrl + media.url;
  }

  public getImageFormatUrl(
    image: StrapiMedia | null | undefined,
    size: 'thumbnail' | 'small' | 'medium' | 'large' | 'xlarge',
  ): string {
    if (image == null) {
      return 'https://herzenshunde-strapi-prod.azurewebsites.net/uploads/paw_e60a248111.svg';
    }

    if (!image.formats) {
      return image.url;
    }

    let toReturn = '';

    switch (size) {
      case 'thumbnail':
        toReturn = image.formats.thumbnail.url;
        break;
      case 'small':
        toReturn = image.formats.small?.url ?? image.formats.thumbnail.url;
        break;
      case 'medium':
        toReturn =
          image.formats.medium?.url ??
          image.formats.small?.url ??
          image.formats.thumbnail.url;
        break;
      case 'large':
        toReturn =
          image.formats.large?.url ??
          image.formats.medium?.url ??
          image.formats.small?.url ??
          image.formats.thumbnail.url;
        break;
      case 'xlarge':
        toReturn =
          image.formats.xlarge?.url ??
          image.formats.large?.url ??
          image.formats.medium?.url ??
          image.formats.small?.url ??
          image.formats.thumbnail.url;
        break;
    }

    return StrapiService.uploadsBaseUrl + toReturn;
  }

  public getImageFormatUrls(
    images: StrapiMedia[],
    size: 'thumbnail' | 'small' | 'medium' | 'large' | 'xlarge',
  ) {
    return images.map(img => this.getImageFormatUrl(img, size));
  }

  public addDraftsInDevMode(url: string): string {
    if(!showDrafts) return url;
    return url + (url.includes("?") ? "&" : "?") + "publicationState=preview";
  }
}

function flattenStrapiObject(data: any) {
  const isObject = (data: any) =>
    Object.prototype.toString.call(data) === '[object Object]';
  const isArray = (data: any) =>
    Object.prototype.toString.call(data) === '[object Array]';

  function flatten(data: any) {
    if (!data) return data;

    return {
      id: data.id,
      ...data,
    };
  }

  if (isArray(data)) {
    return data.map((item: any) => flattenStrapiObject(item));
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
      data[key] = flattenStrapiObject(data[key]);
    }

    return data;
  }

  return data;
}
