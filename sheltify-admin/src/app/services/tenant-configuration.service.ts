import { Injectable, signal, inject } from '@angular/core';
import { firstValueFrom, of, tap } from 'rxjs';
import { CmsTenantConfiguration, SpecialArticleSections } from 'sheltify-lib/cms-types';
import { CmsRequestService } from 'src/app/services/cms-request.service';

@Injectable({providedIn: 'root'})
export class TenantConfigurationService {
  private cmsRequestService = inject(CmsRequestService);


  public needsRebuild = signal(false);

  constructor() {
    this.reloadConfig();

    /* to avoid reloading the config everytime we modify any data, we copy what the backend does here. This is currently
     only used for visual feedback - once it gets used for anything more critical, this might need to be reevaluated */
    this.cmsRequestService.postPatchOrDeleteCalled$.subscribe(_ => {
      this.needsRebuild.set(true);
    })
  }

  public config = signal<CmsTenantConfiguration | undefined>(undefined);

  /** returns tenants siteUrl with / at the end or undefined */
  async siteUrl(): Promise<string | undefined> {
    const siteUrl = (await firstValueFrom(this.getOrLoad()))?.SiteUrl;

    if(siteUrl) {
      return siteUrl.endsWith('/') ? siteUrl : siteUrl + '/';
    }
    return undefined;
  }

  async animalKinds(): Promise<string[]> {
    return this.stringValueToArray('AnimalKinds');
  }

  async blogCategories(): Promise<string[]> {
    return this.stringValueToArray('BlogCategories');
  }

  async animalStati(): Promise<string[]> {
    return this.stringValueToArray('AnimalStati');
  }

  async providedArticleThemeUrl(): Promise<string> {
    return await this.siteUrl() + 'provided-article-theme.css';
  }

  private _specialSections?: SpecialArticleSections;
  async providedSpecialSections(): Promise<SpecialArticleSections | undefined> {
    if(this._specialSections) return this._specialSections;
    const url = await this.siteUrl() + 'provided-special-sections.js';
    const module = await import(url);
    this._specialSections = module.default;
    return this._specialSections;
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

  async reloadConfig() {
    const config = await firstValueFrom(this.cmsRequestService.getTenantConfiguration());
    this.config.set(config);
    this.needsRebuild.set(config.NeedsRebuild);
  }
}
