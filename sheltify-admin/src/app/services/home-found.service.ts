import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CmsHomeFoundEntry } from 'sheltify-lib/cms-types';
import { CmsRequestService } from 'src/app/services/cms-request.service';

@Injectable({
  providedIn: 'root',
})
export class HomeFoundService {
  constructor(private readonly cmsRequestService: CmsRequestService) {
    this.reloadEntries();
  }

  public entries = signal<CmsHomeFoundEntry[]>([]);

  public async reloadEntries() {
    const entries = await firstValueFrom(this.cmsRequestService.getHomeFoundEntries());
    console.log("e", entries);
    this.entries.set(entries ?? []);
  }
}
