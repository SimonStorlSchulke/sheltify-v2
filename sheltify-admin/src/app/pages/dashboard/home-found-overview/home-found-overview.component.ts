import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapCardImage } from '@ng-icons/bootstrap-icons';
import { AnimalService } from '@app/services/animal.service';
import { CmsImageDirective } from '@app/ui/cms-image.directive';
import { homeFoundPerYear, recentHomeFound } from '../dashboard-stats';

@Component({
  selector: 'app-home-found-overview',
  imports: [RouterLink, DatePipe, CmsImageDirective, NgIcon],
  providers: [provideIcons({bootstrapCardImage})],
  templateUrl: './home-found-overview.component.html',
  styleUrl: './home-found-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeFoundOverviewComponent {
  private animalService = inject(AnimalService);

  recent = computed(() => recentHomeFound(this.animalService.animals(), 6));

  perYear = computed(() => {
    const entries = homeFoundPerYear(this.animalService.animals(), 5);
    const max = Math.max(1, ...entries.map(e => e.count));
    return entries.map(e => ({...e, ratio: e.count / max}));
  });

  hasAny = computed(() => this.perYear().some(e => e.count > 0));
}
