import { Component, inject } from '@angular/core';
import { TenantConfigurationService } from 'src/app/services/tenant-configuration.service';
import { CmsImageDirective } from 'src/app/ui/cms-image.directive';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [
    UserMenuComponent,
    RouterLink,
    RouterLinkActive,
    CmsImageDirective
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  router = inject(Router);
  tenantConfigurationService = inject(TenantConfigurationService);

  constructor() {
  }
}
