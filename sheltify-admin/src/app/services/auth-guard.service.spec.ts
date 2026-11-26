import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { AuthGuard, SuperAdminAuthGuard } from './auth-guard.service';
import { AuthService, CmsUser } from './auth.service';

describe('auth guards', () => {
  let user: Partial<CmsUser> | null;
  let navigate: ReturnType<typeof vi.fn>;
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  beforeEach(() => {
    user = null;
    navigate = vi.fn().mockResolvedValue(true);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { reLogin: () => of(user) } },
        { provide: Router, useValue: { navigate } },
      ],
    });
  });

  describe('AuthGuard', () => {
    it('allows logged in users', async () => {
      user = { ID: '1' };
      expect(await TestBed.inject(AuthGuard).canActivate(route, state)).toBe(true);
      expect(navigate).not.toHaveBeenCalled();
    });

    it('redirects to the login otherwise', async () => {
      expect(await TestBed.inject(AuthGuard).canActivate(route, state)).toBe(false);
      expect(navigate).toHaveBeenCalledWith(['login']);
    });
  });

  describe('SuperAdminAuthGuard', () => {
    it('allows super admins', async () => {
      user = { ID: '1', Role: 'SUPERADMIN' };
      expect(await TestBed.inject(SuperAdminAuthGuard).canActivate(route, state)).toBe(true);
    });

    it('denies admins', async () => {
      user = { ID: '1', Role: 'ADMIN' };
      expect(await TestBed.inject(SuperAdminAuthGuard).canActivate(route, state)).toBe(false);
    });

    it('denies anonymous users', async () => {
      expect(await TestBed.inject(SuperAdminAuthGuard).canActivate(route, state)).toBe(false);
    });
  });
});
