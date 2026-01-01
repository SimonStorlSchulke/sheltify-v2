import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { TenantConfigurationService } from 'src/app/services/tenant-configuration.service';
import { BtIconComponent } from 'src/app/ui/bt-icon/bt-icon.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [
    UserMenuComponent,
    RouterLink,
    RouterLinkActive,
    DatePipe,
    BtIconComponent,
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
      const response = await firstValueFrom(this.cmsRequestService.triggerBuild());
      console.log(response)
      await this.tenantConfigurationService.reloadConfig();
    } finally {
      this.building.set(false);
    }
  }
}
