import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';
import { CmsAnimal, CmsBlogEntry, CmsPage } from 'sheltify-lib/dist/cms-types';
import { AdministrationComponent } from '@app/administration/administration.component';
import { PageListComponent } from '@app/editor/blog-list/page-list.component';
import { HomeFoundListComponent } from '@app/editor/home-found-list/home-found-list.component';
import { BlogListComponent } from '@app/editor/page-list/blog-list.component';
import { TeammemberListComponent } from '@app/editor/teammember-list/teammember-list.component';
import { MediaLibraryComponent } from '@app/media-library/media-library.component';
import { askSaveGuard } from '@app/services/ask-save.guard';
import { CmsRequestService } from '@app/services/cms-request.service';
import { TenantConfigurationComponent } from '@app/tenant-configuration/tenant-configuration.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AnimalListComponent } from './editor/animal-list/animal-list.component';
import { AuthGuard, SuperAdminAuthGuard } from './services/auth-guard.service';
import { SubmittedFormsComponent } from './submitted-forms/submitted-forms.component';

const animalResolver: ResolveFn<CmsAnimal> = (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id')!;
  return inject(CmsRequestService).getAnimal(id);
}

const blogResolver: ResolveFn<CmsBlogEntry> = (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id')!;
  return inject(CmsRequestService).getBlogEntry(id);
}

const pageResolver: ResolveFn<CmsPage> = (route: ActivatedRouteSnapshot) => {
  const path = route.paramMap.get('path')!;
  return inject(CmsRequestService).getPageByPath(path);
}

export const routes: Routes = [
  {path: "", component: DashboardComponent, canActivate: [AuthGuard]},
  {path: "login", component: LoginComponent},
  {path: "seiten", component: PageListComponent, canActivate: [AuthGuard]},
  {path: "seiten/:path", component: PageListComponent, canActivate: [AuthGuard], canDeactivate: [askSaveGuard], resolve: {page: pageResolver}},
  {path: "blog", component: BlogListComponent, canActivate: [AuthGuard]},
  {path: "blog/:id", component: BlogListComponent, canActivate: [AuthGuard], canDeactivate: [askSaveGuard], resolve: {blog: blogResolver} },
  {path: "rueckmeldungen", component: HomeFoundListComponent, canActivate: [AuthGuard]},
  {path: "rueckmeldungen/:id", component: HomeFoundListComponent, canActivate: [AuthGuard]},
  {path: "team", component: TeammemberListComponent, canActivate: [AuthGuard]},
  {path: "team/:id", component: TeammemberListComponent, canActivate: [AuthGuard]},
  {path: "media", component: MediaLibraryComponent, canActivate: [AuthGuard]},
  {path: "optionen", component: TenantConfigurationComponent, canActivate: [AuthGuard]},
  {path: "tiere", component: AnimalListComponent, canActivate: [AuthGuard]},
  {path: "tiere/:id", component: AnimalListComponent, canActivate: [AuthGuard], canDeactivate: [askSaveGuard], resolve: {animal: animalResolver}},
  {path: "formulare", component: SubmittedFormsComponent, canActivate: [AuthGuard]},
  {path: "formulare/:id", component: SubmittedFormsComponent, canActivate: [AuthGuard]},
  {path: "administration", component: AdministrationComponent, canActivate: [SuperAdminAuthGuard]},
];
