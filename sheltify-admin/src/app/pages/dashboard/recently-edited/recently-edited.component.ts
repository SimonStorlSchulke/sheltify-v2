import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { TenantConfigurationService } from 'src/app/services/tenant-configuration.service';
import { CmsImageDirective } from 'src/app/ui/cms-image.directive';

@Component({
  selector: 'app-recently-edited',
  imports: [
    AsyncPipe,
    RouterLink,
    CmsImageDirective,
    NgIcon,
    DatePipe
  ],
  templateUrl: './recently-edited.component.html',
  styleUrl: './recently-edited.component.scss',
})
export class RecentlyEditedComponent {

  public tenantConfigurationService = inject(TenantConfigurationService);
  public authService = inject(AuthService);
  private cmsRequestService = inject(CmsRequestService);

  public lastModifiedAnimals = firstValueFrom(this.cmsRequestService.getLastModifiedAnimals(10));
}
