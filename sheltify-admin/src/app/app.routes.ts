import { Routes } from '@angular/router';
import { PageListComponent } from 'src/app/editor/page-list/page-list.component';
import { MediaLibraryComponent } from 'src/app/media-library/media-library.component';
import { TenantConfigurationComponent } from 'src/app/tenant-configuration/tenant-configuration.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AnimalListComponent } from './editor/animal-list/animal-list.component';
import { AuthGuard } from './services/auth-guard.service';

export const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard]},
  {path: "seiten", component: PageListComponent, canActivate: [AuthGuard]},
  {path: "seiten/:id", component: PageListComponent, canActivate: [AuthGuard]},
  {path: "media", component: MediaLibraryComponent, canActivate: [AuthGuard]},
  {path: "optionen", component: TenantConfigurationComponent, canActivate: [AuthGuard]},
  {path: "tiere", component: AnimalListComponent, canActivate: [AuthGuard]},
  {path: "tiere/:id", component: AnimalListComponent, canActivate: [AuthGuard]},
];
