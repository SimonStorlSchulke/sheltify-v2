import { Service, signal, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CmsHomeFoundEntry } from 'sheltify-lib/cms-types';
import { CmsRequestService } from '@app/services/cms-request.service';

@Service()
export class HomeFoundService {
  private readonly cmsRequestService = inject(CmsRequestService);

  constructor() {
    this.reloadEntries();
  }

  entries = signal<CmsHomeFoundEntry[]>([]);

  async reloadEntries() {
    const entries = await firstValueFrom(this.cmsRequestService.getHomeFoundEntries());
    console.log("e", entries);
    this.entries.set(entries ?? []);
  }
}
