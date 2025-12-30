import { Injectable, inject } from '@angular/core';
import { AnimalsFilter, CmsArticle } from 'sheltify-lib/article-types';
import { ToastrService } from 'ngx-toastr';
import { CmsAnimal, CmsBlogEntry, CmsImage, CmsPage, CmsTag, CmsTeamMember, CmsTenantConfiguration } from 'sheltify-lib/cms-types';
import { sortByPriorityAndUpdatedAt } from 'sheltify-lib/cms-utils';
import { LoaderService } from 'src/app/layout/loader/loader.service';
import { AuthService, CmsUser } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map, timer, tap, OperatorFunction, lastValueFrom, Subject } from 'rxjs';


export type CollectionResult<T> = {
  results: T[] | null,
}

@Injectable({providedIn: 'root'})
export class CmsRequestService {

  private authService = inject(AuthService);
  private httpClient = inject(HttpClient);
  private toastrSv = inject(ToastrService);
  private loaderSv = inject(LoaderService);
  public postPatchOrDeleteCalled$ = new Subject<string>();

  public static readonly adminApiUrl = 'http://localhost:3000/admin/api/';
  public static readonly publicApiUrl = 'http://localhost:3000/api/';

  private options(contentType = 'application/json', raw = false) {
    return {
      raw,
      timeout: 10000,
      headers: {
        'Content-Type': contentType,
        Authorization: `Bearer ${this.authService.bearer}`,
      },
      withCredentials: true,
    };
  }

  public getTeamMembers(): Observable<CmsTeamMember[]> {
    return this.get<CmsTeamMember[]>(`${this.publicTenantsUrl}/teammembers`);
  }

  public getTeamMember(id: string): Observable<CmsTeamMember> {
    return this.get<CmsTeamMember>(`${this.publicTenantsUrl}/teammembers/` + id);
  }

  public saveTeamMember(user: CmsTeamMember): Observable<CmsTeamMember> {
    return this.postOrPatch<CmsTeamMember>('teammembers', user);
  }

  public deleteTeamMember(ids: string[]): Observable<void> {
    return this.delete(`teammembers?ids=${ids.join(',')}`)
  }

  public getBlogEntries(): Observable<CmsBlogEntry[]> {
    return this.get<CmsBlogEntry[]>(`${this.publicTenantsUrl}/blogs`);
  }

  public getBlogEntry(id: string): Observable<CmsBlogEntry> {
    return this.get<CmsBlogEntry>(`${this.publicTenantsUrl}/blogs/` + id);
  }

  public saveBlogEntry(user: CmsBlogEntry): Observable<CmsBlogEntry> {
    return this.postOrPatch<CmsBlogEntry>('blogs', user);
  }

  public deleteBlogEntries(ids: string[]) {
    return this.delete(`blogs?ids=${ids.join(',')}`)
  }

  public getPages(): Observable<CmsPage[]> {
    return this.get<CmsPage[]>(`${this.publicTenantsUrl}/pages`).pipe(
      map(response => sortByPriorityAndUpdatedAt(response)))
  }

  public getPageByPath(path: string): Observable<CmsPage> {
    return this.get<CmsPage>(`${this.publicTenantsUrl}/page-by-path?path=${path}`);
  }

  public savePage(page: CmsPage): Observable<CmsPage> {
    return this.postOrPatch('pages', page);
  }

  public deletePages(ids: string[]) {
    return this.delete(`pages?ids=${ids.join(',')}`)
  }


  public getTenantConfiguration(): Observable<CmsTenantConfiguration> {
    return this.get<CmsTenantConfiguration>(`${CmsRequestService.adminApiUrl}configuration`);
  }

  public saveTenantConfiguration(config: CmsTenantConfiguration): Observable<CmsTenantConfiguration> {
    return this.patch<CmsTenantConfiguration>('configuration', config);
  }

  public getAnimals(): Observable<CollectionResult<CmsAnimal>> {
    return this.get<CmsAnimal[]>(`${this.publicTenantsUrl}/animals/home-found`).pipe(
      map(response => ({
          results: sortByPriorityAndUpdatedAt(response),
        })
      ));
  }

  public getLastModifiedAnimals(amount: number): Observable<CmsAnimal[]> {
    return this.get<CmsAnimal[]>(`${this.publicTenantsUrl}/animals/last-modified?amount=${amount}`);
  }

  public getAnimalsByArticleId(articleId: string): Observable<CollectionResult<CmsAnimal>> {
    return this.get<CmsAnimal[]>(`${this.publicTenantsUrl}/animals/by-article/${articleId}`).pipe(map(response => ({
      results: response,
    })));
  }

  public getAnimal(id: string): Observable<CmsAnimal> {
    return this.get<CmsAnimal>(`${this.publicTenantsUrl}/animals/${id}`)
  }

  public getFilteredAnimals(filter: AnimalsFilter): Observable<CmsAnimal[]> {
    let query = ``;

    if(filter.AnimalKind) query += `kind=${filter.AnimalKind}&`;
    if(filter.MaxNumber) query += `maxNumber=${filter.MaxNumber}&`;
    if(filter.AgeRange[0]) query += `ageMin=${filter.AgeRange[0]}&`;
    if(filter.AgeRange[1]) query += `ageMax=${filter.AgeRange[1]}&`;
    if(filter.SizeRange[0]) query += `sizeMin=${filter.SizeRange[0]}&`;
    if(filter.SizeRange[1]) query += `sizeMax=${filter.SizeRange[1]}&`;
    if(filter.Gender != 'both') query += `gender=${filter.Gender}&`;

    return this.get<CmsAnimal[]>(`${this.publicTenantsUrl}/animals/filtered?${query}`);
  }

  public saveAnimal(animal: CmsAnimal): Observable<CmsAnimal> {
    return this.postOrPatch('animals', animal);
  }

  public deleteAnimals(ids: string[]) {
    return this.delete<CmsAnimal>(`animals?ids=${ids.join(',')}`)
  }

  public deleteHomeFoundEntries(ids: string[]): Observable<void> {
    return this.delete(`home-found-entries?ids=${ids.join(',')}`)
  }

  public createTag(tag: Omit<CmsTag, "ID">): Observable<CmsTag> {
    return this.post<CmsTag>(`tags`, tag)
  }

  public getTags() {
    return this.get<CmsTag[]>(`${this.publicTenantsUrl}/tags`)
  }

  public deleteTag(id: string): Observable<void> {
    return this.delete(`tags/` + id)
  }

  public getMediaByIds(ids: string[], tenantId: string): Observable<CmsImage[]> {
    return this.get<CmsImage[]>(`${this.publicTenantsUrl}/media?ids=` + ids.join(','));
  }

  public getMediaByTags(tags: string[], tenantId: string): Observable<CmsImage[]> {
    return this.get<CmsImage[]>(`${this.publicTenantsUrl}/media-by-tags?tags=` + tags.join(','));
  }

  public getMediaByAnimalIDs(animalIds: string[]): Observable<CmsImage[]> {
    return this.get<CmsImage[]>(`${this.publicTenantsUrl}/media-by-animals?animalIds=` + animalIds.join(','));
  }

  public getArticle(id: string) {
    return this.get<CmsArticle>(`${this.publicTenantsUrl}/article/${id}`)
  }

  public saveArticle( article: CmsArticle) {
    return this.postOrPatch<CmsArticle>(`article`, article);
  }

  public async updateMedia(image: CmsImage): Promise<CmsImage> {
    return lastValueFrom(this.patch<CmsImage>(`media`, image));
  }

  public triggerBuild() {
    return this.httpClient.get(CmsRequestService.adminApiUrl + 'trigger-build', {
      timeout: 10000,
      responseType: 'text',
      headers: {
        Authorization: `Bearer ${this.authService.bearer}`,
      },
      withCredentials: true,
    });
  }

  public uploadScaledImage(files: { size: string; blob: Blob; }[], fileName: string, commaSeparatedTags: string, commaSeparatedAnimalIds: string) {
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
    data.append('AnimalIDs', commaSeparatedAnimalIds);

    const options = {
      headers: {
        Authorization: `Bearer ${this.authService.bearer}`,
      },
      withCredentials: true,
    }

    return this.httpClient.post(url, data, options)
      .pipe(this.handleRequest(url));
  }

  public uploadFiles(files: Blob[], fileName: string, commaSeparatedTags: string, commaSeparatedAnimalIds: string) {
    const url = CmsRequestService.adminApiUrl + 'files';
    const tenantId = this.authService.getTenantID();
    const data = new FormData();

    for (const file of files) {
      data.append('File', file);
    }

    data.append('FileName', fileName);
    data.append('Title', fileName);
    data.append('Description', "");
    data.append('TenantID', tenantId);
    data.append('Tags', commaSeparatedTags);
    data.append('AnimalIDs', commaSeparatedAnimalIds);

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
    return this.delete('media/' + id);
  }

  private get<T>(path: string): Observable<T> {
    const url = decodeURIComponent(path);
    return this.httpClient.get<T>(url, this.options())
      .pipe(this.handleRequest(url));
  }

  private delete<T>(path: string): Observable<T> {
    const url = decodeURIComponent(CmsRequestService.adminApiUrl + path);
    return this.httpClient.delete<T>(url, this.options())
      .pipe(this.handleRequest(url, 'Löschen erfolgreich'), tap(() => this.postPatchOrDeleteCalled$.next(path)));
  }

  public post<T>(path: string, body: any) {
    const url = decodeURIComponent(CmsRequestService.adminApiUrl + path);
    if (body.ID) body.ID = undefined;
    return this.httpClient.post<T>(url, body, this.options())
      .pipe(this.handleRequest(url, 'Erstellen erfolgreich'), tap(() => this.postPatchOrDeleteCalled$.next(path)));
  }

  public patch<T>(path: string, body: any) {
    const url = decodeURIComponent(CmsRequestService.adminApiUrl + path);
    return this.httpClient.patch<T>(url, body, this.options())
      .pipe(this.handleRequest(url, 'Speichern erfolgreich'), tap(() => this.postPatchOrDeleteCalled$.next(path)));
  }

  /** uses PATCH if data has ID, else PATCH */
  public postOrPatch<T>(path: string, data: { ID?: number | string }): Observable<T> {
    if (data.ID && data.ID != '') {
      return this.patch<T>(path, data);
    } else {
      return this.post<T>(path, data);
    }
  }

  private get publicTenantsUrl() {
    return CmsRequestService.publicApiUrl + this.authService.getTenantID();
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
