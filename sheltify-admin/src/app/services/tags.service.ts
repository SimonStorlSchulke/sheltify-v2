import { Injectable, signal, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { CmsTag } from 'sheltify-lib/cms-types';
import { CmsRequestService } from 'src/app/services/cms-request.service';

@Injectable({providedIn: 'root'})
export class TagsService {
  private cmsRequestService = inject(CmsRequestService);

  public availableTags = signal<CmsTag[]>([]);

  async updateAvailableTags() {
    this.availableTags.set(await lastValueFrom(this.cmsRequestService.getTags()));
  }
}
