import { Component, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CmsRequestService } from 'src/app/services/cms-request.service';
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
  building = signal(false);

  constructor(private cmsRequestService: CmsRequestService) {
  }

  public async triggerBuild() {
    this.building.set(true);
    try {
      await firstValueFrom(this.cmsRequestService.triggerBuild());
      await this.tenantConfigurationService.reloadConfig();
    } finally {
      this.building.set(false);
    }
  }
}
