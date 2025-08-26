import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, Subject, BehaviorSubject, catchError, of } from 'rxjs';
import { CmsRequestService } from './cms-request.service';

export type CmsUser = {
  CreatedAt: string
  UpdatedAt: string
  DeletedAt: any
  ID: string
  HashedPassword: string
  SessionToken: string
  CsrfToken: string
  TenantID: string
  Tenant: any
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private _bearer = "";
  get bearer(): string {
    return this._bearer;
  }

  private _user$ = new BehaviorSubject<CmsUser | null>(null);

  public user$ = this._user$.asObservable();

  public login(username: string, password: string): Observable<CmsUser> {
    const formData: FormData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return this.httpClient.post<CmsUser>(CmsRequestService.adminApiUrl + "login", formData, { withCredentials: true }).pipe(
      tap(response => {
        console.log("logged in as " + response.ID)
        this._user$.next(response);
      })
    );
  }

  public reLogin() {
    return this.httpClient.get<CmsUser>(CmsRequestService.adminApiUrl + "relogin", { withCredentials: true }).pipe(
      catchError(_ => of(null)),
      tap(response => {
        if (response) {
          console.log("relogged in as " + response.ID)
          this._user$.next(response);
        }
      })
    );
  }

  logout() {
    return this.httpClient.get<CmsUser>(CmsRequestService.adminApiUrl + "logout", { withCredentials: true }).subscribe(response => {
        console.log(response)
      });
  }

  public getLoggedInUser() {
    return this._user$.value;
  }

  public getTenantID() {
    return this.getLoggedInUser()?.TenantID ?? "";
  }
}
