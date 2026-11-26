import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { firstValueFrom } from 'rxjs';
import { CmsRequestService } from '@app/services/cms-request.service';
import { CmsImageDirective } from '@app/ui/cms-image.directive';

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
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './recently-edited.component.scss',
})
export class RecentlyEditedComponent {

  private cmsRequestService = inject(CmsRequestService);

  lastModifiedAnimals = firstValueFrom(this.cmsRequestService.getLastModifiedAnimals(10));
}
