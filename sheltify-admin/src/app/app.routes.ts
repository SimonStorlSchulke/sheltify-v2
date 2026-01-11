import { Routes } from '@angular/router';
import { PageListComponent } from 'src/app/editor/blog-list/page-list.component';
import { HomeFoundListComponent } from 'src/app/editor/home-found-list/home-found-list.component';
import { BlogListComponent } from 'src/app/editor/page-list/blog-list.component';
import { TeammemberListComponent } from 'src/app/editor/teammember-list/teammember-list.component';
import { MediaLibraryComponent } from 'src/app/media-library/media-library.component';
import { TenantConfigurationComponent } from 'src/app/tenant-configuration/tenant-configuration.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AnimalListComponent } from './editor/animal-list/animal-list.component';
import { AuthGuard } from './services/auth-guard.service';
import { SubmittedFormsComponent } from './submitted-forms/submitted-forms.component';

export const routes: Routes = [
  {path: "", component: DashboardComponent, canActivate: [AuthGuard]},
  {path: "login", component: LoginComponent},
  {path: "seiten", component: PageListComponent, canActivate: [AuthGuard]},
  {path: "seiten/:path", component: PageListComponent, canActivate: [AuthGuard]},
  {path: "blog", component: BlogListComponent, canActivate: [AuthGuard]},
  {path: "blog/:id", component: BlogListComponent, canActivate: [AuthGuard]},
  {path: "rueckmeldungen", component: HomeFoundListComponent, canActivate: [AuthGuard]},
  {path: "rueckmeldungen/:id", component: HomeFoundListComponent, canActivate: [AuthGuard]},
  {path: "team", component: TeammemberListComponent, canActivate: [AuthGuard]},
  {path: "team/:id", component: TeammemberListComponent, canActivate: [AuthGuard]},
  {path: "media", component: MediaLibraryComponent, canActivate: [AuthGuard]},
  {path: "optionen", component: TenantConfigurationComponent, canActivate: [AuthGuard]},
  {path: "tiere", component: AnimalListComponent, canActivate: [AuthGuard]},
  {path: "tiere/:id", component: AnimalListComponent, canActivate: [AuthGuard]},
  {path: "formulare", component: SubmittedFormsComponent, canActivate: [AuthGuard]},
  {path: "formulare/:id", component: SubmittedFormsComponent, canActivate: [AuthGuard]},
];
