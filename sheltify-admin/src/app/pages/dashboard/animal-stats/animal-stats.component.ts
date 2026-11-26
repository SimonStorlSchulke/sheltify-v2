import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AnimalService } from '@app/services/animal.service';
import { CmsRequestService } from '@app/services/cms-request.service';
import { TenantConfigurationService } from '@app/services/tenant-configuration.service';
import { catchError, map, of } from 'rxjs';
import { computeAnimalStats, CountEntry, countByKind, countByStatus, isFormUnread } from '../dashboard-stats';

type Tile = { label: string; value: number; hint?: string; link?: string; highlight?: boolean };

@Component({
  selector: 'app-animal-stats',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './animal-stats.component.html',
  styleUrl: './animal-stats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimalStatsComponent {
  private animalService = inject(AnimalService);
  private cmsRequestService = inject(CmsRequestService);
  private tenantConfigurationService = inject(TenantConfigurationService);

  private stati = signal<string[]>([]);

  private unreadForms = toSignal(
    this.cmsRequestService.getSubmittedForms().pipe(
      map(forms => (forms ?? []).filter(isFormUnread).length),
      catchError(() => of(0)),
    ),
    {initialValue: 0},
  );

  stats = computed(() => computeAnimalStats(this.animalService.animals()));

  tiles = computed<Tile[]>(() => {
    const s = this.stats();
    const unread = this.unreadForms();
    return [
      {label: 'Tiere in Vermittlung', value: s.available, hint: `${s.total} insgesamt`, link: '/tiere'},
      {label: 'Veröffentlicht', value: s.published, hint: `${s.drafts} nicht veröffentlicht`, link: '/tiertabelle'},
      {label: 'Reserviert', value: s.reserved, link: '/tiertabelle'},
      {label: `Vermittelt ${new Date().getFullYear()}`, value: s.homeFoundThisYear, hint: `Vorjahr: ${s.homeFoundLastYear}`},
      {label: 'Paten gesucht', value: s.patronsNeeded},
      {label: 'Ungelesene Formulare', value: unread, link: '/formulare', highlight: unread > 0},
    ];
  });

  byKind = computed(() => withRatio(countByKind(this.animalService.animals())));
  byStatus = computed(() => withRatio(countByStatus(this.animalService.animals(), this.stati())));

  showKinds = computed(() => this.byKind().length > 1);

  constructor() {
    this.tenantConfigurationService.animalStati().then(stati => this.stati.set(stati));
  }
}

function withRatio(entries: CountEntry[]) {
  const max = Math.max(1, ...entries.map(e => e.count));
  return entries.map(e => ({...e, ratio: e.count / max}));
}
