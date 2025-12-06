import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CmsArticle } from 'src/app/cms-types/article-types';
import { CmsAnimal, CmsImage, CmsTag, CmsTenantConfiguration } from 'src/app/cms-types/cms-types';
import { LoaderService } from 'src/app/layout/loader/loader.service';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map, timer, tap, OperatorFunction, lastValueFrom } from 'rxjs';


export type CollectionResult<T> = {
  results: T[] | null,
}

export type AnimalsFilter = {
  AnimalKind: string | undefined,
  MaxNumber: number | undefined,
  AgeRange: [number | undefined, number | undefined],
  SizeRange: [number | undefined, number | undefined],
  Gender: 'male' | 'female' | 'both',
  InGermany: boolean | undefined,
}

@Injectable({providedIn: 'root'})
export class CmsRequestService {

  private authService = inject(AuthService);
  private httpClient = inject(HttpClient);
  private toastrSv = inject(ToastrService);
  private loaderSv = inject(LoaderService);

  public static readonly adminApiUrl = 'http://localhost:3000/admin/api/';
  public static readonly publicApiUrl = 'http://localhost:3000/api/';

  private options(contentType = 'application/json') {
    return {
      timeout: 10000,
      headers: {
        'Content-Type': contentType,
        Authorization: `Bearer ${this.authService.bearer}`,
      },
      withCredentials: true,
    };
  }

  public getTenantConfiguration(): Observable<CmsTenantConfiguration> {
    const tenantId = this.authService.getTenantID();
    return this.get<CmsTenantConfiguration>(`${CmsRequestService.publicApiUrl}${tenantId}/configuration`);
  }

  public saveTenantConfiguration(config: CmsTenantConfiguration): Observable<CmsTenantConfiguration> {
    return this.patch<CmsTenantConfiguration>('configuration', config);
  }

  public getTenantsAnimals(): Observable<CollectionResult<CmsAnimal>> {
    const tenantId = this.authService.getTenantID();
    return this.get<CmsAnimal[]>(`${CmsRequestService.publicApiUrl}${tenantId}/animals`).pipe(map(response => {
      response.sort((a, b) => a.Name.localeCompare(b.Name));
      return {
        results: response,
      }
    }));
  }

  public getAnimalsByArticleId(articleId: number): Observable<CollectionResult<CmsAnimal>> {
    const tenantId = this.authService.getTenantID();
    return this.get<CmsAnimal[]>(`${CmsRequestService.publicApiUrl}${tenantId}/animals/by-article/${articleId}`).pipe(map(response => ({
      results: response,
    })));
  }

  public getTenantsAnimal(id: number): Observable<CmsAnimal> {
    const tenantId = this.authService.getTenantID();
    return this.get<CmsAnimal>(`${CmsRequestService.publicApiUrl}${tenantId}/animals/${id}`)
  }

  public getFilteredAnimals(filter: AnimalsFilter): Observable<CmsAnimal[]> {
    const tenantId = this.authService.getTenantID();
    let query = ``;

    if(filter.AnimalKind) query += `kind=${filter.AnimalKind}&`;
    if(filter.MaxNumber) query += `maxNumber=${filter.MaxNumber}&`;
    if(filter.AgeRange[0]) query += `ageMin=${filter.AgeRange[0]}&`;
    if(filter.AgeRange[1]) query += `ageMax=${filter.AgeRange[1]}&`;
    if(filter.SizeRange[0]) query += `sizeMin=${filter.SizeRange[0]}&`;
    if(filter.SizeRange[1]) query += `sizeMax=${filter.SizeRange[1]}&`;
    if(filter.Gender != 'both') query += `gender=${filter.Gender}&`;

    return this.get<CmsAnimal[]>(`${CmsRequestService.publicApiUrl}${tenantId}/animals/filtered?${query}`);
  }

  public saveAnimal(animal: CmsAnimal): Observable<CmsAnimal> {
    return this.postOrPatch('animals', animal);
  }

  public deleteAnimals(ids: number[]) {
    return this.delete<CmsAnimal>(`animals?ids=${ids.join(',')}`)
  }

  public createTag(tag: Omit<CmsTag, "ID">): Observable<CmsTag> {
    return this.post<CmsTag>(`tags`, tag)
  }

  public getTenantsTags() {
    const tenantId = this.authService.getTenantID();
    return this.get<CmsTag[]>(`${CmsRequestService.publicApiUrl}${tenantId}/tags`)
  }

  public deleteTag(id: number): Observable<void> {
    return this.delete(`tags/` + id)
  }

  public getMediaByTags(tags: string[], tenantId: string): Observable<CmsImage[]> {
    return this.get<CmsImage[]>(`${CmsRequestService.publicApiUrl}${tenantId}/media?tags=` + tags.join(','));
  }

  public getArticle(id: number) {
    const tenantId = this.authService.getTenantID();
    return this.get<CmsArticle>(`${CmsRequestService.publicApiUrl}${tenantId}/article/${id}`)
  }

  public saveArticle( article: CmsArticle) {
    return this.postOrPatch<CmsArticle>(`article`, article);
  }

  public async updateMedia(image: CmsImage): Promise<CmsImage> {
    return lastValueFrom(this.patch<CmsImage>(`media`, image));
  }

  public uploadScaledImage(files: { size: string, blob: Blob }[], fileName: string, commaSeparatedTags: string) {
    const url = CmsRequestService.adminApiUrl + 'media/scaled';
    const tenantId = this.authService.getTenantID();
    const data = new FormData();

    for (const file of files) {
      data.append(file.size, file.blob);
    }

    data.append('FocusX', "0.5");
    data.append('FileName', fileName);
    data.append('Title', fileName.replace(/\.[^/.]+$/, ""));
    data.append('FocusY', "0.5");
    data.append('Description', "");
    data.append('TenantID', tenantId);
    data.append('Tags', commaSeparatedTags);

    const options = {
      headers: {
        Authorization: `Bearer ${this.authService.bearer}`,
      },
      withCredentials: true,
    }

    return this.httpClient.post(url, data, options)
      .pipe(this.handleRequest(url));
  }

  public deleteImage(id: string): Observable<void> {
    return this.delete(CmsRequestService.adminApiUrl + 'media/' + id);
  }

  private get<T>(path: string): Observable<T> {
    const url = decodeURIComponent(path);
    return this.httpClient.get<T>(url, this.options())
      .pipe(this.handleRequest(url));
  }

  private delete<T>(path: string): Observable<T> {
    const url = decodeURIComponent(CmsRequestService.adminApiUrl + path);
    return this.httpClient.delete<T>(url, this.options())
      .pipe(this.handleRequest(url, 'Löschen erfolgreich'));
  }

  public post<T>(path: string, body: any) {
    const url = decodeURIComponent(CmsRequestService.adminApiUrl + path);
    if (body.ID) body.ID = undefined;
    return this.httpClient.post<T>(url, body, this.options())
      .pipe(this.handleRequest(url, 'Erstellen erfolgreich'));
  }

  public patch<T>(path: string, body: any) {
    const url = decodeURIComponent(CmsRequestService.adminApiUrl + path);
    return this.httpClient.patch<T>(url, body, this.options())
      .pipe(this.handleRequest(url, 'Speichern erfolgreich'));
  }

  /** uses PATCH if data has ID, else PATCH */
  public postOrPatch<T>(path: string, data: { ID?: number | string }): Observable<T> {
    if (data.ID) {
      return this.patch<T>(path, data);
    } else {
      return this.post<T>(path, data);
    }
  }

  private handleRequest<T>(
    url: string,
    message: string = "",
  ): OperatorFunction<T, T> {
    const loadTimerMs = 300;
    return (source: Observable<T>): Observable<T> => {
      const loaderText = (new URL(url).pathname);

      let timerSub = timer(loadTimerMs)
        .subscribe({
          next: () => this.loaderSv.setLoading(loaderText),
        });

      return source.pipe(
        tap({
          next: () => {
              if (message != "") {
                this.toastrSv.success(new URL(url).pathname, message)
              }
          },
          error: (e) => {
            console.log(e.error);
            this.toastrSv.error(
              e.error.replace ? e.error.replace("\n", "<br>") : '',
              "Fehler",
              {enableHtml: true, timeOut: 2500}
            );
          },
          finalize: () => {
            this.loaderSv.unsetLoading(loaderText)
            timerSub.unsubscribe();
          },
        })
      );
    }
  }
}
