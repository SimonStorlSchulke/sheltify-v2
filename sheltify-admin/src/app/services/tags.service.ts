import { Injectable, signal, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { CmsTag } from 'sheltify-lib/cms-types';
import { CmsRequestService } from '@app/services/cms-request.service';

@Injectable({providedIn: 'root'})
export class TagsService {
  private cmsRequestService = inject(CmsRequestService);

  availableTags = signal<CmsTag[]>([]);

  async updateAvailableTags() {
    this.availableTags.set(await lastValueFrom(this.cmsRequestService.getTags()));
  }
}
