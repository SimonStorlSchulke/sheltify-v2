import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { bootstrapCardImage } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { TenantConfigurationService } from 'src/app/services/tenant-configuration.service';
import { CmsImageDirective } from 'src/app/ui/cms-image.directive';
import { TextEditorComponent } from '../../editor/text-editor/text-editor.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    AsyncPipe,
    RouterLink,
    DatePipe,
    CmsImageDirective,
    NgIcon
  ],
  providers: [provideIcons({bootstrapCardImage})],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(public authService: AuthService, public tenantConfigurationService: TenantConfigurationService) {
  }

  cmsRequestService = inject(CmsRequestService);

  lastModifiedAnimals = firstValueFrom(this.cmsRequestService.getLastModifiedAnimals(10));
}
