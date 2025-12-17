import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CmsPage } from 'src/app/cms-types/cms-types';
import { CmsRequestService } from 'src/app/services/cms-request.service';

@Injectable({
  providedIn: 'root',
})
export class PagesService {
  constructor(private readonly cmsRequestService: CmsRequestService) {
    this.reloadPages();
  }

  public pages = signal<CmsPage[]>([]);

  public async reloadPages() {
    const pages = await firstValueFrom(this.cmsRequestService.getPages());
    this.pages.set(pages ?? []);
  }

  public async savePage(page: CmsPage) {
    const savedPage = await firstValueFrom(this.cmsRequestService.savePage(page));
    if (savedPage) {
      this.reloadPages();
      page.LastModifiedBy = savedPage.LastModifiedBy;
      page.UpdatedAt = savedPage.UpdatedAt;
    }
  }

  public createTitleFromPath(path: string) {
    const pathSegments = path.split('/');
    return pathSegments[pathSegments.length - 1]
      .replace('-', ' ')
      .replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
      );
  }

  async togglePublished(page: CmsPage) {
    const pageToSave = structuredClone(page);
    if(pageToSave.PublishedAt?.Valid) {
      pageToSave.PublishedAt = {
        Valid: false,
        Time: null,
      };
      return await firstValueFrom(this.cmsRequestService.savePage(pageToSave));
    } else {
      pageToSave.PublishedAt = {
        Valid: true,
        Time: new Date().toISOString(),
      }
      return await firstValueFrom(this.cmsRequestService.savePage(pageToSave));
    }

  }
}

