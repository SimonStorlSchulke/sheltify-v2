import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  authService = inject(AuthService);
  router = inject(Router);

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<GuardResult> {
      const isLoggedIn = await lastValueFrom(this.authService.reLogin().pipe(map(user => !!user?.ID)));
      if (!isLoggedIn) {
        await this.router.navigate(["login"])
      }
      return isLoggedIn;

  }
}
