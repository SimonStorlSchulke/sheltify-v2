import { Injectable, signal } from '@angular/core';
import { firstValueFrom, of, tap } from 'rxjs';
import { CmsTenantConfiguration } from 'sheltify-lib/cms-types';
import { CmsRequestService } from 'src/app/services/cms-request.service';

@Injectable({
  providedIn: 'root',
})
export class TenantConfigurationService {

  public needsRebuild = signal(false);

  constructor(private readonly cmsRequestService: CmsRequestService) {
    this.reloadConfig();

    /* to avoid reloading the config everytime we modify any data, we copy what the backend does here. This is currently
     only used for visual feedback - once it gets used for anything more critical, this might need to be reevaluated */
    this.cmsRequestService.postPatchOrDeleteCalled$.subscribe(_ => {
      this.needsRebuild.set(true);
    })
  }

  public config = signal<CmsTenantConfiguration | undefined>(undefined);

  /** returns tenants siteUrl with / at the end or undefined */
  public async siteUrl(): Promise<string | undefined> {
    const siteUrl = (await firstValueFrom(this.getOrLoad()))?.SiteUrl;

    if(siteUrl) {
      return siteUrl.endsWith('/') ? siteUrl : siteUrl + '/';
    }
    return undefined;
  }

  public async animalKinds(): Promise<string[]> {
    return this.stringValueToArray('AnimalKinds');
  }

  public async blogCategories(): Promise<string[]> {
    return this.stringValueToArray('BlogCategories');
  }

  public async animalStati(): Promise<string[]> {
    return this.stringValueToArray('AnimalStati');
  }

  private async stringValueToArray(key: keyof CmsTenantConfiguration): Promise<string[]> {
    const config = await firstValueFrom(this.getOrLoad());
    if(!config) return [];
    const str = config[key] as string;
    if(!str) return [];
    return str.split(",") ?? []
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
    this.needsRebuild.set(config.NeedsRebuild);
  }
}
