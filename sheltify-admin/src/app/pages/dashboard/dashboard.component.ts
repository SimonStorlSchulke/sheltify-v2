import { AsyncPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { AttentionListComponent } from '@app/pages/dashboard/attention-list/attention-list.component';
import { HomeFoundOverviewComponent } from '@app/pages/dashboard/home-found-overview/home-found-overview.component';
import { RecentFormsComponent } from '@app/pages/dashboard/recent-forms/recent-forms.component';
import { RecentlyEditedComponent } from '@app/pages/dashboard/recently-edited/recently-edited.component';
import { AnimalService } from '@app/services/animal.service';
import { AuthService } from '@app/services/auth.service';
import { TenantConfigurationService } from '@app/services/tenant-configuration.service';
import { BtIconComponent } from '@app/ui/bt-icon/bt-icon.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    AsyncPipe,
    AttentionListComponent,
    HomeFoundOverviewComponent,
    BtIconComponent,
    RecentlyEditedComponent,
    RecentFormsComponent,
  ],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  tenantConfigurationService = inject(TenantConfigurationService);
  authService = inject(AuthService);

  readonly greeting = greetingFor(new Date());
  readonly siteUrl = computed(() => this.tenantConfigurationService.config()?.SiteUrl || undefined);

  constructor() {
    // the animal service is a singleton and might hold stale data from an earlier visit
    inject(AnimalService).reloadAnimals();
  }
}

function greetingFor(date: Date): string {
  const hour = date.getHours();
  if (hour < 11) return 'Guten Morgen';
  if (hour < 18) return 'Hallo';
  return 'Guten Abend';
}
