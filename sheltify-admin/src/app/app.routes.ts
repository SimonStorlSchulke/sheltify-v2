import { inject, provideEnvironmentInitializer } from '@angular/core';
import { Routes } from '@angular/router';
import { PageListComponent } from 'src/app/editor/blog-list/page-list.component';
import { BlogListComponent } from 'src/app/editor/page-list/blog-list.component';
import { TeammemberListComponent } from 'src/app/editor/teammember-list/teammember-list.component';
import { MediaLibraryComponent } from 'src/app/media-library/media-library.component';
import { TenantConfigurationService } from 'src/app/services/tenant-configuration.service';
import { TenantConfigurationComponent } from 'src/app/tenant-configuration/tenant-configuration.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AnimalListComponent } from './editor/animal-list/animal-list.component';
import { AuthGuard } from './services/auth-guard.service';

export const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "dashboard", component: DashboardComponent, providers: [
    provideEnvironmentInitializer(async () => {
      await inject(TenantConfigurationService).reloadConfig(); //TODO sse
    })
    ]},
  {path: "seiten", component: PageListComponent, canActivate: [AuthGuard]},
  {path: "seiten/:path", component: PageListComponent, canActivate: [AuthGuard]},
  {path: "blog", component: BlogListComponent, canActivate: [AuthGuard]},
  {path: "blog/:id", component: BlogListComponent, canActivate: [AuthGuard]},
  {path: "team", component: TeammemberListComponent, canActivate: [AuthGuard]},
  {path: "team/:id", component: TeammemberListComponent, canActivate: [AuthGuard]},
  {path: "media", component: MediaLibraryComponent, canActivate: [AuthGuard]},
  {path: "optionen", component: TenantConfigurationComponent, canActivate: [AuthGuard]},
  {path: "tiere", component: AnimalListComponent, canActivate: [AuthGuard]},
  {path: "tiere/:id", component: AnimalListComponent, canActivate: [AuthGuard]},
];
