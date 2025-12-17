import { Injectable, signal } from '@angular/core';
import { firstValueFrom, of, tap } from 'rxjs';
import { CmsTenantConfiguration } from 'src/app/cms-types/cms-types';
import { CmsRequestService } from 'src/app/services/cms-request.service';

@Injectable({
  providedIn: 'root',
})
export class TenantConfigurationService {
  constructor(private readonly cmsRequestService: CmsRequestService) {
    this.reloadConfig();
  }

  public config = signal<CmsTenantConfiguration | undefined>(undefined);

  public async animalKinds(): Promise<string | undefined> {
    return (await firstValueFrom(this.getOrLoad()))?.AnimalKinds;
  }

  public getOrLoad() {
    if(this.config()) {
      return of(this.config());
    }
    return this.cmsRequestService.getTenantConfiguration()
      .pipe(tap(config => this.config.set(config)));
  }

  public async reloadConfig() {
    const config = await firstValueFrom(this.cmsRequestService.getTenantConfiguration());
    this.config.set(config);
  }
}
