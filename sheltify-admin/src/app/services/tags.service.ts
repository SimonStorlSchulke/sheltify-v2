import { Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { CmsTag } from 'src/app/cms-types/cms-types';
import { CmsRequestService } from 'src/app/services/cms-request.service';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  public availableTags = signal<CmsTag[]>([]);

  constructor(
    private cmsRequestService: CmsRequestService,
    ) {
  }

  public async updateAvailableTags() {
    this.availableTags.set(await lastValueFrom(this.cmsRequestService.getTenantsTags()));
  }
}
