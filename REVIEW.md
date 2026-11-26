# Project Review – sheltify-v2

_Review date: 2026-11-09_

Overall structure (Go backend, Angular admin, Astro multi-tenant clients, shared Svelte renderer + `sheltify-lib`) is sensible. The main problems are security-related.

---

## ✅ Already done (small fixes)

- Removed debug `console.log`s in `clients/shared/cms/sheltify-access.ts` and `clients/shared/cms/cms-image.ts`
- Fixed typo in `README.md` ("hinzufügen in hinzufügen")
- Deleted dead/orphaned files:
  - `clients/shared/cms/index.ts` (empty)
  - `clients/sites/snhg/public/article.css.map` (no matching css)
  - `clients/shared/components/svelte-parts/Header.svelte` + `HeaderEntry.svelte` (unused, broken import of `sheltify-lib/dist/page-structure.ts`)
- Untracked `.idea/` (was already in `.gitignore`) and `sheltify-backend/sheltify-backend.exe` (22 MB); added `*.exe` to `sheltify-backend/.gitignore`
- `sheltify-backend/repository/animal-repository.go`: `query.Where(...)` → `query = query.Where(...)` in names filter (only worked by GORM side effect)

---

## 🔴 Critical – Security

### 1. Committed secrets
- `sheltify-backend/.env.prod` contains what appear to be real credentials (DB password, hash salt, SMTP API key, API bearer).
- `sheltify-admin/src/app/services/tenant-configuration.service.ts:64-65` contains a hardcoded Basic-auth credential shipped to the browser.
- **Action:** rotate all secrets, remove from repo (`git rm --cached`), consider history rewrite. Move admin Basic-auth to backend.

> Comments:
> Ignore for now -these are just for testing.

### 2. SQL injection
- `sheltify-backend/repository/util.go` (`DefaultGetByIDs`): IDs are interpolated into the `ORDER BY CASE` clause via `fmt.Sprintf("WHEN '%s' ...")`. Reachable via the public `GET /api/{tenant}/media?ids=...`.
- **Action:** parameterize (e.g. `clause.Expr` with `?` placeholders) or validate IDs as UUIDs, or sort in Go.

> Comments: Do the proposed action.

### 3. Tenant isolation
- `repository/user-repository.go`: user/session lookup, update, delete are not tenant-scoped; `GetUsers` ignores its `tenant` argument.
- `handlers/user-handler.go`: SUPERADMIN can edit/delete any user by ID, and `SaveUser` allows moving users between tenants.
- `handlers/tenant-handler-cms.go:65-78`: config save trusts `TenantID` from the request body.
- `handlers/media-handler.go:109`: `UploadFiles` takes `TenantID` from form data instead of `user.TenantID`.
- `repository/media-repository.go`, `services/media-service.go`: media lookup/save by ID only; tags resolved globally by name.
- Repository `Save`/`Delete` generally don't enforce tenant ownership.
- **Action:** always derive tenant from the authenticated user; scope every repository query by tenant.

> Comments:
> - GetUsers ignoring the tenant is by-design. I removed thew parameter. 
> - SUPERADMIN can do everything. That's by-design too.
> - SaveTenantConfiguration --> yes you are right - please get the tenantId from the user instead
> - media-handler.go > UploadFiles --> yes you are right - please get the tenantId from the user instead
> - Repository `Save`/`Delete` --> yes you are right. Please implement the proposed changes.

---

## 🟠 High

- **Form submit URL hardcoded to localhost** – `clients/shared/cms/sheltify-access.ts` (`formSubmitUrl`) always returns `http://localhost:3000/forms/...` → forms likely broken in production.
- **Auth/session** (`services/auth-service.go`):
  - cookies lack `Secure` / `SameSite` / explicit `MaxAge`; name says 24h, actual ~72h
  - cookie values (session/CSRF tokens) are logged
  - `GenerateToken` uses `log.Fatalf` → crashes server on error
  - `Logout` ignores `GetUserByName` error and dereferences `user`
  - password hash errors ignored
  - CSRF handling incomplete (TODO, typo `csfrToken`)
- **CORS** – `main.go:17`: `AllowedOrigins: https://*` with credentials.
- **No role checks** on most mutating admin routes (`routes.go`).
- **Uploads** (`handlers/media-handler.go`, `services/media-service.go`):
  - `ParseMultipartForm` errors ignored → 50 MB limit not reliably enforced; `io.ReadAll` loads entire file into memory
  - ignored error at ~line 255 → possible nil-pointer panic
  - file extension derived from user-controlled `OriginalFileName`
  - uploads served publicly without tenant check
  - multi-step writes (media/tags/animals) not transactional
- **XSS in admin** – `bypassSecurityTrustHtml` in `section-renderer/render-html/render-trusted-html.component.ts`, also used for submitted form content and toasts.

> Comments:
> All of these are fine and by-design.

---

## 🟡 Structure / Tooling

### Monorepo setup
- `apps/web` and `apps/docs` are unused Turborepo/Next.js scaffold.
- `pnpm-workspace.yaml` (`apps/*`, `packages/*`) and `turbo.json` (`.next` outputs) don't reflect the real packages.
- Both `package-lock.json` and `pnpm-lock.yaml` at root; each package also has its own `package-lock.json`.
- **Decision needed:** set up a real workspace (pnpm + turbo over backend-adjacent TS packages) or remove scaffold.

> Comments:
> Ignore for now - later I'd like to make this repository use turborepo efficiently.

### Clients
- `clients/sites/testsite` is an outdated, unreferenced copy of `hhg` (`sites/test` is the one used by `npm run test`).
- Build scripts use POSIX `ENVIRONMENT=production` (dev scripts use `cross-env` with `MY_ENV`) – inconsistent, breaks on Windows.
- `postbuild` runs pagefind only for `dist/snhg`.
- Only `snhg` has a production `outDir`; `hhg`/`mft` don't.
- Query params not URL-encoded in `sheltify-access.ts` (`path`, `title`, `category`, `names`, ...).
- `getBlogEntries(categories)` – parameter unused.
- Prod detection in browser = "any non-localhost origin".

> Comments:
> If you can. update testsite and make it only use what is really needed to run the tests
> Build scripts ENVIRONMENT --> Yes - please fix it.

### Duplication
- URL/environment config duplicated: `clients/shared/cms/sheltify-access.ts`, `article-renderer/config.ts`, admin services, `ui/cms-image.pipe.ts` (hardcoded fallback).
- `getImageSrc` / `getLargestAvailableImageSize` duplicated in `clients/shared/cms/cms-image.ts`, `article-renderer/util.ts`, `sheltify-lib/image-utils.ts`.
- `sheltify-lib` has committed build artifacts (`page-structure.js`, `page-structure.d.ts`) next to the `.ts` source; imports mix `sheltify-lib/...`, `sheltify-lib/dist/...` and relative paths.
- `article-renderer/package.json` name is `svelte-web-components` but it is consumed as `article-renderer`.

> Comments:

### Backend
- Layering (handlers → services → repository) is inconsistent: handlers often call repositories directly; services are mostly pass-through.
- Error handling inconsistent: ignored errors, mixed `http.Error`/helpers/`fmt.Println`/`log`/`logger`; some handlers write multiple responses (`handlers/util.go` `DefaultGetLastModified`, `handlers/tenant-handler-cms.go:26-42`).
- `repository/init.go` prints the DB DSN and requires `.env` at runtime.
- `Dockerfile` exposes `8000`, app listens on `3000`; `docker-compose.yml` only runs Postgres.
- `handlers/static-files-handler.go` panics on URL params.
- Naming inconsistencies (`DefaultGetById`/`DefaultGetByIds`/`DeleteByIDS`, `tenantId`/`TenantID`), typo `skipUpdateModicationDate`.

> Comments:
> handlers calling repository is fine as defined by the architecture document.
> 

### Admin (Angular)
- Both `layout/` and `layouts/` folders.
- 17+ `section-editor-*` components repeat the same pattern (Subject + debounce + reload + mutate) → extract shared base/service.
- Debounced requests are not cancelled (no `switchMap`) → stale results can overwrite newer ones (e.g. `section-editor-animal-list`).
- Missing teardown in `section-editor-home-found` subscription.
- `firstValueFrom` calls without error handling (e.g. `submitted-forms.component.ts`).
- `AuthService.logout()` doesn't clear `_user$`.
- `ChangeDetectionStrategy.Eager` everywhere + in-place mutation; no `OnPush`.
- `@angular/cdk` 21 vs Angular 22; both Karma/Jasmine and Vitest installed; `build-prod` duplicates prod config.
- `angular.json` depends on `../article-renderer/dist/web-components.js` without a build-order guarantee.
- `any` leaks (`auth.service.ts`, `cms-request.service.ts`, `input-base.component.ts`).
- Trivial: `services/page-tructure.ts` (typo), `isStatisActive`, `pupups`, many leftover `console.log`s.

> Comments:

---

## Testing
- Backend: no `*_test.go` files.
- Admin: only generated "should create" specs.
- `uitests` (Playwright): one spec, no scripts in `package.json`.
- **Suggestion:** start with backend tests for tenant isolation + auth, since those are the riskiest areas.

> Comments:
