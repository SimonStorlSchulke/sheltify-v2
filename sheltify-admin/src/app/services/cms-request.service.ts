import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CmsAnimal, CmsImage, CmsTag } from 'src/app/cms-types/cms-types';
import { LoaderService } from 'src/app/layout/loader/loader.service';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map, timer, tap, OperatorFunction, lastValueFrom } from 'rxjs';

export type EntryMetaData = {
  availableStatus: {
    //todo
  }
}

export type CollectionResult<T> = {
  results: T[] | null,
}

export type EntryResult<T> = {
  data: T,
  meta: EntryMetaData,
}

@Injectable({
  providedIn: 'root'
})
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

  public getTenantsAnimals(): Observable<CollectionResult<CmsAnimal>> {
    const tenantId = this.authService.getTenantID();
    return this.get<CmsAnimal[]>(`${CmsRequestService.publicApiUrl}${tenantId}/animals`).pipe(map(response => ({
      results: response,
    })));
  }

  public getTenantsAnimal(id: number): Observable<CmsAnimal> {
    const tenantId = this.authService.getTenantID();
    return this.get<CmsAnimal>(`${CmsRequestService.publicApiUrl}${tenantId}/animals/${id}`)
  }

  public saveAnimal(animal: CmsAnimal): Observable<CmsAnimal> {
    return this.patch<CmsAnimal>(`animals`, animal)
  }

  public deleteAnimals(ids: number[]) {
    return this.delete<CmsAnimal>(`${CmsRequestService.adminApiUrl}animals?ids=${ids.join(',')}`)
  }

  public createTag(tag: Omit<CmsTag, "ID">): Observable<CmsTag> {
    return this.post<CmsTag>(`tags`, tag)
  }

  public getTenantsTags() {
    const tenantId = this.authService.getTenantID();
    return this.get<CmsTag[]>(`${CmsRequestService.publicApiUrl}${tenantId}/tags`)
  }

  public deleteTag(id: number): Observable<void> {
    return this.delete(`${CmsRequestService.adminApiUrl}tags/` + id)
  }

  public getMediaByTags(tags: string[], tenantId: string): Observable<CmsImage[]> {
    return this.get<CmsImage[]>(`${CmsRequestService.publicApiUrl}${tenantId}/media?tags=` + tags.join(','));
  }

  public async updateMedia(image: CmsImage): Promise<CmsImage> {
    return lastValueFrom(this.patch<CmsImage>(`media`, image));
  }

  public uploadScaledImage(files: { size: string, blob: Blob}[], fileName: string, commaSeparatedTags: string) {
    const url = decodeURIComponent(CmsRequestService.adminApiUrl + 'media/scaled');
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
    const url = decodeURIComponent(CmsRequestService.adminApiUrl + 'media/' + id);
    return this.delete(url);
  }

  private get<T>(path: string): Observable<T> {
    const url = decodeURIComponent(path);
    return this.httpClient.get<T>(url, this.options())
      .pipe(this.handleRequest(url));
  }

  private delete<T>(path: string): Observable<T> {
    const url = decodeURIComponent(path);
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

  private handleRequest<T>(
    url: string,
    message: string = "",
  ): OperatorFunction<T, T> {
    const loadTimerMs = 300;
    return (source: Observable<T>): Observable<T> => {
      const loaderText = (new URL(url).pathname);
      let timerSub = timer(loadTimerMs).subscribe(() => {
        this.loaderSv.setLoading(loaderText);
      });
      return source.pipe(
        tap({
          next: () => {
            timerSub.unsubscribe();
            timerSub = timer(loadTimerMs).subscribe(() => {
              this.loaderSv.unsetLoading(loaderText);
              if(message != "") {
                this.toastrSv.success(new URL(url).pathname, message)
              }
            });
          },
          error: (e) => {
            this.loaderSv.unsetLoading(loaderText);
            console.log(e.error);
            this.toastrSv.error(
              e.error.replace("\n", "<br>"),
              "Fehler",
              {enableHtml: true, timeOut: 2500}
            );
            timerSub.unsubscribe();
          }
        })
      );
    }
  }
}
