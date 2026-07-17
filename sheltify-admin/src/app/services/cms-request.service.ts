import { Service, inject } from '@angular/core';
import { AnimalsFilter, CmsArticle } from 'sheltify-lib/article-types';
import {
  CmsAnimal,
  CmsBlogEntry,
  CmsFormSubmission,
  CmsHomeFoundEntry,
  CmsImage,
  CmsPage,
  CmsTag,
  CmsTeamMember,
  CmsTenantConfiguration,
} from 'sheltify-lib/cms-types';
import { collectCmsImageGuidsDeep, filterPublishedAndHasArticle, sortByPriorityAndUpdatedAt } from 'sheltify-lib/cms-utils';
import { LoaderService } from '@app/layout/loader/loader.service';
import { AlertService } from '@app/services/alert.service';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map, timer, tap, OperatorFunction, lastValueFrom, Subject, firstValueFrom } from 'rxjs';


export type CollectionResult<T> = {
  results: T[] | null,
}

@Service()
export class CmsRequestService {

  private authService = inject(AuthService);
  private httpClient = inject(HttpClient);
  private alertSv = inject(AlertService);
  private loaderSv = inject(LoaderService);
  postPatchOrDeleteCalled$ = new Subject<string>();

  static readonly adminApiUrl = 'http://localhost:3000/admin/api/';
  static readonly publicApiUrl = 'http://localhost:3000/api/';

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

  getTeamMembers(): Observable<CmsTeamMember[]> {
    return this.get<CmsTeamMember[]>(`${this.publicTenantsUrl}/teammembers`);
  }

  getTeamMember(id: string): Observable<CmsTeamMember> {
    return this.get<CmsTeamMember>(`${this.publicTenantsUrl}/teammembers/` + id);
  }

  saveTeamMember(user: CmsTeamMember): Observable<CmsTeamMember> {
    return this.postOrPatch<CmsTeamMember>('teammembers', user);
  }

  deleteTeamMember(ids: string[]): Observable<void> {
    return this.delete(`teammembers?ids=${ids.join(',')}`)
  }

  getBlogEntries(): Observable<CmsBlogEntry[]> {
    return this.get<CmsBlogEntry[]>(`${this.publicTenantsUrl}/blogs`);
  }

  getPaginatedBlogEntries(pageSize: number, pageIndex: number, category: string): Observable<CmsBlogEntry[]> {
    return this.get<CmsBlogEntry[]>(`${this.publicTenantsUrl}/blogs/by-pagination?pageSize=${pageSize}&pageIndex=${pageIndex}&category=${category}`);
  }

  getBlogEntry(id: string): Observable<CmsBlogEntry> {
    return this.get<CmsBlogEntry>(`${this.publicTenantsUrl}/blogs/` + id);
  }

  saveBlogEntry(user: CmsBlogEntry): Observable<CmsBlogEntry> {
    return this.postOrPatch<CmsBlogEntry>('blogs', user);
  }

  deleteBlogEntries(ids: string[]) {
    return this.delete(`blogs?ids=${ids.join(',')}`)
  }

  getHomeFoundEntries(): Observable<CmsHomeFoundEntry[]> {
    return this.get<CmsHomeFoundEntry[]>(`${this.publicTenantsUrl}/home-found-entries`);
  }

  getHomeFoundEntry(id: string): Observable<CmsHomeFoundEntry> {
    return this.get<CmsHomeFoundEntry>(`${this.publicTenantsUrl}/home-found-entries/` + id);
  }

  saveHomeFoundEntry(user: CmsHomeFoundEntry): Observable<CmsHomeFoundEntry> {
    return this.postOrPatch<CmsHomeFoundEntry>('home-found-entries', user);
  }

  deleteHomeFoundEntries(ids: string[]): Observable<void> {
    return this.delete(`home-found-entries?ids=${ids.join(',')}`)
  }

  getPages(): Observable<CmsPage[]> {
    return this.get<CmsPage[]>(`${this.publicTenantsUrl}/pages`).pipe(
      map(response => sortByPriorityAndUpdatedAt(response)))
  }

  getPageByPath(path: string): Observable<CmsPage> {
    return this.get<CmsPage>(`${this.publicTenantsUrl}/page-by-path?path=${encodeURIComponent(path)}`);
  }

  savePage(page: CmsPage): Observable<CmsPage> {
    return this.postOrPatch('pages', page);
  }

  deletePages(ids: string[]) {
    return this.delete(`pages?ids=${ids.join(',')}`)
  }


  getTenantConfiguration(): Observable<CmsTenantConfiguration> {
    return this.get<CmsTenantConfiguration>(`${CmsRequestService.adminApiUrl}configuration`);
  }

  saveTenantConfiguration(config: CmsTenantConfiguration): Observable<CmsTenantConfiguration> {
    return this.patch<CmsTenantConfiguration>('configuration', config);
  }

  getAnimals(): Observable<CollectionResult<CmsAnimal>> {
    return this.get<CmsAnimal[]>(`${this.publicTenantsUrl}/animals`).pipe(
      map(response => ({
          results: sortByPriorityAndUpdatedAt(response),
        })
      ));
  }

  getPublishedAnimals() {
    return this.getAnimals().pipe(map(animals => animals
      .results?.filter(animal => animal.PublishedAt?.Valid && !!animal.ArticleID && animal.ArticleID != 'NoArticle')));
  }

  getLastModifiedAnimals(amount: number): Observable<CmsAnimal[]> {
    return this.get<CmsAnimal[]>(`${this.publicTenantsUrl}/animals/last-modified?amount=${amount}`);
  }

  getAnimalsByArticleId(articleId: string): Observable<CollectionResult<CmsAnimal>> {
    return this.get<CmsAnimal[]>(`${this.publicTenantsUrl}/animals/by-article/${articleId}`).pipe(map(response => ({
      results: response,
    })));
  }

  getAnimal(id: string): Observable<CmsAnimal> {
    return this.get<CmsAnimal>(`${this.publicTenantsUrl}/animals/${id}`)
  }

  getFilteredAnimals(filter: AnimalsFilter): Observable<CmsAnimal[]> {
    let query = ``;

    if(filter.AnimalKind) query += `kind=${filter.AnimalKind}&`;
    if(filter.MaxNumber) query += `maxNumber=${filter.MaxNumber}&`;
    if(filter.AgeRange[0]) query += `ageMin=${filter.AgeRange[0]}&`;
    if(filter.AgeRange[1]) query += `ageMax=${filter.AgeRange[1]}&`;
    if(filter.SizeRange[0]) query += `sizeMin=${filter.SizeRange[0]}&`;
    if(filter.SizeRange[1]) query += `sizeMax=${filter.SizeRange[1]}&`;
    if(filter.Gender != 'both') query += `gender=${filter.Gender}&`;

    return this.get<CmsAnimal[]>(`${this.publicTenantsUrl}/animals/filtered?${query}`)
      .pipe(map(response => sortByPriorityAndUpdatedAt(filterPublishedAndHasArticle(response))));
  }

  getAnimalUpdates(days: number): Observable<CmsAnimal[]> {
    return this.get<CmsAnimal[]>(`${this.publicTenantsUrl}/animals/updates/${days}`)
      .pipe(map(response => sortByPriorityAndUpdatedAt(filterPublishedAndHasArticle(response))));
  }

  saveAnimal(animal: CmsAnimal): Observable<CmsAnimal> {
    return this.postOrPatch('animals', animal);
  }

  deleteAnimals(ids: string[]) {
    return this.delete<CmsAnimal>(`animals?ids=${ids.join(',')}`)
  }

  createTag(tag: Omit<CmsTag, "ID">): Observable<CmsTag> {
    return this.post<CmsTag>(`tags`, tag)
  }

  getTags() {
    return this.get<CmsTag[]>(`${this.publicTenantsUrl}/tags`)
  }

  deleteTag(id: string): Observable<void> {
    return this.delete(`tags/` + id)
  }

  getMediaByIds(ids: string[], tenantId: string): Observable<CmsImage[]> {
    return this.get<CmsImage[]>(`${this.publicTenantsUrl}/media?ids=` + ids.join(','));
  }

  getMediaByTags(tags: string[], tenantId: string): Observable<CmsImage[]> {
    return this.get<CmsImage[]>(`${this.publicTenantsUrl}/media-by-tags?tags=` + tags.join(','));
  }

  async getUnlinkedMediaFiles(): Promise<CmsImage[]> {
    const unlinkedFiles = await firstValueFrom(this.get<CmsImage[]>(`${CmsRequestService.adminApiUrl}media/unlinked`));
    const allTenantsArticles = await firstValueFrom(this.getArticles())
    const imgageIdsInArticles = collectCmsImageGuidsDeep(allTenantsArticles);
    return unlinkedFiles.filter(mediaFile => !imgageIdsInArticles.includes(mediaFile.ID))
  }

  getMediaByAnimalIDs(animalIds: string[]): Observable<CmsImage[]> {
    return this.get<CmsImage[]>(`${this.publicTenantsUrl}/media-by-animals?animalIds=` + animalIds.join(','));
  }

  getArticles() {
    return this.get<CmsArticle[]>(`${this.publicTenantsUrl}/articles`)
  }

  getArticle(id: string) {
    return this.get<CmsArticle>(`${this.publicTenantsUrl}/article/${id}`)
  }

  saveArticle( article: CmsArticle) {
    return this.postOrPatch<CmsArticle>(`article`, article);
  }

  async updateMedia(image: CmsImage): Promise<CmsImage> {
    return lastValueFrom(this.patch<CmsImage>(`media`, image));
  }

  triggerBuild() {
    return this.httpClient.get(CmsRequestService.adminApiUrl + 'trigger-build', {
      timeout: 10000,
      responseType: 'text',
      headers: {
        Authorization: `Bearer ${this.authService.bearer}`,
      },
      withCredentials: true,
    });
  }

  readSubmittedForm(id: string) {
    return this.post<CmsFormSubmission[]>(`forms/read/${id}`, {});
  }

  getRecentSubmittedForms() {
    return this.httpClient.get<CmsFormSubmission[]>(CmsRequestService.adminApiUrl + 'forms/recent', this.options());
  }

  getSubmittedForms() {
    return this.httpClient.get<CmsFormSubmission[]>(CmsRequestService.adminApiUrl + 'forms/submitted', this.options());
  }

  getSubmittedForm(id: string) {
    return this.httpClient.get<CmsFormSubmission>(CmsRequestService.adminApiUrl + 'forms/submitted/' + id, this.options());
  }

   deleteSubmittedForms(ids: string[]): Observable<void> {
    return this.delete(`forms/submitted?ids=${ids.join(',')}`)
  }

  uploadScaledImage(files: { size: string; blob: Blob; }[], fileName: string, commaSeparatedTags: string, commaSeparatedAnimalIds: string) {
    const url = CmsRequestService.adminApiUrl + 'media/scaled';
    const data = new FormData();

    for (const file of files) {
      data.append(file.size, file.blob);
    }

    data.append('FocusX', "0.5");
    data.append('FileName', fileName);
    data.append('Title', fileName.replace(/\.[^/.]+$/, ""));
    data.append('FocusY', "0.5");
    data.append('Description', "");
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

  replaceScaledImage(files: { size: string; blob: Blob; }[], imageId: string): Observable<CmsImage> {
    const url = CmsRequestService.adminApiUrl + `media/replace-scaled/${imageId}`;
    const data = new FormData();

    for (const file of files) {
      data.append(file.size, file.blob);
    }

    const options = {
      headers: {
        Authorization: `Bearer ${this.authService.bearer}`,
      },
      withCredentials: true,
    }

    return this.httpClient.post<CmsImage>(url, data, options)
      .pipe(this.handleRequest(url));
  }

  uploadFiles(files: Blob[], fileName: string, commaSeparatedTags: string, commaSeparatedAnimalIds: string) {
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

  deleteImages(ids: string[]): Observable<void> {
    return this.delete(`media?ids=${ids.join(',')}`);
  }

  get<T>(path: string): Observable<T> {
    return this.httpClient.get<T>(path, this.options())
      .pipe(this.handleRequest(path));
  }

  private delete<T>(path: string): Observable<T> {
    const url = CmsRequestService.adminApiUrl + path;
    return this.httpClient.delete<T>(url, this.options())
      .pipe(this.handleRequest(url, 'Löschen erfolgreich'), tap(() => this.postPatchOrDeleteCalled$.next(path)));
  }

  post<T>(path: string, body: any) {
    const url = CmsRequestService.adminApiUrl + path;
    if (body.ID) body.ID = undefined;
    return this.httpClient.post<T>(url, body, this.options())
      .pipe(this.handleRequest(url, 'Erstellen erfolgreich'), tap(() => this.postPatchOrDeleteCalled$.next(path)));
  }

  patch<T>(path: string, body: any) {
    const url = CmsRequestService.adminApiUrl + path;
    return this.httpClient.patch<T>(url, body, this.options())
      .pipe(this.handleRequest(url, 'Speichern erfolgreich'), tap(() => this.postPatchOrDeleteCalled$.next(path)));
  }

  /** uses PATCH if data has ID, else PATCH */
  postOrPatch<T>(path: string, data: { ID?: number | string }): Observable<T> {
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
                this.alertSv.openToast(message, new URL(url).pathname, 'success')
              }
          },
          error: (e) => {
            console.log(e.error);
            this.alertSv.openToast(
              e.error.replace ? e.error.replace("\n", "<br>") : '',
              "Fehler",
              'error',
              //{enableHtml: true, timeOut: 2500}
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

