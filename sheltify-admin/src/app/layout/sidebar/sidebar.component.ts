import { DatePipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { AlertService } from '@app/services/alert.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@app/services/auth.service';
import { CmsRequestService } from '@app/services/cms-request.service';
import { TenantConfigurationService } from '@app/services/tenant-configuration.service';
import { BtIconComponent } from '@app/ui/bt-icon/bt-icon.component';
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
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SidebarComponent {
  private cmsRequestService = inject(CmsRequestService);
  private alertService = inject(AlertService);

  router = inject(Router);
  tenantConfigurationService = inject(TenantConfigurationService);
  isSuperAdmin = inject(AuthService).isSuperAdmin;
  building = signal(false);

  async triggerBuild() {
    this.building.set(true);
    try {
      const response = await firstValueFrom(this.cmsRequestService.triggerBuild());
      console.log(response)
      await this.tenantConfigurationService.reloadConfig();
      this.alertService.openToast('Seite erfolgreich gebaut');
    } finally {
      this.building.set(false);
    }
  }
}
