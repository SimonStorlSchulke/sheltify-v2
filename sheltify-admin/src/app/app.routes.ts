import { Routes } from '@angular/router';
import { AdministrationComponent } from '@app/administration/administration.component';
import { AnimalTableComponent } from '@app/editor/animal-table/animal-table.component';
import { PageListComponent, pageResolver } from '@app/editor/blog-list/page-list.component';
import { HomeFoundListComponent, homeFoundResolver } from '@app/editor/home-found-list/home-found-list.component';
import { BlogListComponent, blogResolver } from '@app/editor/page-list/blog-list.component';
import { ExportPdfComponent } from '@app/export/export-pdf/export-pdf.component';
import { DefaultLayoutComponent } from '@app/layouts/default-layout/default-layout.component';
import { MediaLibraryComponent } from '@app/media-library/media-library.component';
import { askSaveGuard } from '@app/services/ask-save.guard';
import { TenantConfigurationComponent } from '@app/tenant-configuration/tenant-configuration.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AnimalListComponent, animalResolver } from './editor/animal-list/animal-list.component';
import { AuthGuard, SuperAdminAuthGuard } from './services/auth-guard.service';
import { formResolver, SubmittedFormsComponent } from './submitted-forms/submitted-forms.component';

export const routes: Routes = [

  {path: 'export/pdf/:id', component: ExportPdfComponent, canActivate: [AuthGuard], resolve: {animal: animalResolver}},

  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {path: "", component: DashboardComponent, canActivate: [AuthGuard]},
      {path: "login", component: LoginComponent},
      {path: "seiten", component: PageListComponent, canActivate: [AuthGuard], canDeactivate: [askSaveGuard], resolve: {page: pageResolver}},
      {path: "seiten/:path", component: PageListComponent, canActivate: [AuthGuard], canDeactivate: [askSaveGuard], resolve: {page: pageResolver}},
      {path: "blog", component: BlogListComponent, canActivate: [AuthGuard]},
      {path: "blog/:id", component: BlogListComponent, canActivate: [AuthGuard], canDeactivate: [askSaveGuard], resolve: {blog: blogResolver}},
      {path: "rueckmeldungen", component: HomeFoundListComponent, canActivate: [AuthGuard]},
      {path: "rueckmeldungen/:id", component: HomeFoundListComponent, canActivate: [AuthGuard], canDeactivate: [askSaveGuard], resolve: {entry: homeFoundResolver}},
      {path: "media", component: MediaLibraryComponent, canActivate: [AuthGuard]},
      {path: "optionen", component: TenantConfigurationComponent, canActivate: [AuthGuard], canDeactivate: [askSaveGuard]},
      {path: "tiere", component: AnimalListComponent, canActivate: [AuthGuard]},
      {path: "tiertabelle", component: AnimalTableComponent, canActivate: [AuthGuard], canDeactivate: [askSaveGuard]},
      {path: "tiere/:id", component: AnimalListComponent, canActivate: [AuthGuard], canDeactivate: [askSaveGuard], resolve: {animal: animalResolver}},
      {path: "formulare", component: SubmittedFormsComponent, canActivate: [AuthGuard]},
      {path: "formulare/:id", component: SubmittedFormsComponent, canActivate: [AuthGuard], resolve: {form: formResolver}},
      {path: "administration", component: AdministrationComponent, canActivate: [SuperAdminAuthGuard]},
    ]
  },

];
