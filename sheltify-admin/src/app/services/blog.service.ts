import { Service, signal, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CmsBlogEntry, togglePublishedAt } from 'sheltify-lib/cms-types';
import { CmsRequestService } from '@app/services/cms-request.service';

@Service()
export class BlogService {
  private readonly cmsRequestService = inject(CmsRequestService);

  constructor() {
    this.reloadBlogs();
  }

  blogs = signal<CmsBlogEntry[]>([]);

  async reloadBlogs() {
    const pages = await firstValueFrom(this.cmsRequestService.getPaginatedBlogEntries(1000, 1, ''));
    this.blogs.set(pages ?? []);
  }

  async togglePublished(blog: CmsBlogEntry) {
    const blogToSave = structuredClone(blog);
    togglePublishedAt(blogToSave);
    return await firstValueFrom(this.cmsRequestService.saveBlogEntry(blogToSave));
  }
}
