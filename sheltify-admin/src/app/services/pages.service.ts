import { Injectable, signal, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CmsPage, SqlNullTimeNow, togglePublishedAt } from 'sheltify-lib/cms-types';
import { CmsRequestService } from '@app/services/cms-request.service';

@Injectable({providedIn: 'root'})
export class PagesService {
  private readonly cmsRequestService = inject(CmsRequestService);

  constructor() {
    this.reloadPages();
  }

  pages = signal<CmsPage[]>([]);

  async reloadPages() {
    const pages = await firstValueFrom(this.cmsRequestService.getPages());
    this.pages.set(pages ?? []);
  }

  async savePage(page: CmsPage) {
    const savedPage = await firstValueFrom(this.cmsRequestService.savePage(page));
    if (savedPage) {
      this.reloadPages();
      page.LastModifiedBy = savedPage.LastModifiedBy;
      page.UpdatedAt = savedPage.UpdatedAt;
    }
  }

  createTitleFromPath(path: string) {
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
    togglePublishedAt(pageToSave);
    return await firstValueFrom(this.cmsRequestService.savePage(pageToSave));
  }
}

