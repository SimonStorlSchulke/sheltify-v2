import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CmsBlogEntry, SqlNullTimeNow, togglePublishedAt } from 'sheltify-lib/cms-types';
import { CmsRequestService } from 'src/app/services/cms-request.service';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private readonly cmsRequestService: CmsRequestService) {
    this.reloadBlogs();
  }

  public blogs = signal<CmsBlogEntry[]>([]);

  public async reloadBlogs() {
    const pages = await firstValueFrom(this.cmsRequestService.getBlogEntries());
    this.blogs.set(pages ?? []);
  }

  async togglePublished(blog: CmsBlogEntry) {
    const blogToSave = structuredClone(blog);
    togglePublishedAt(blogToSave);
    return await firstValueFrom(this.cmsRequestService.saveBlogEntry(blogToSave));
  }
}
