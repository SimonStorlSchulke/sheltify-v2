import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CmsArticle } from 'sheltify-lib/article-types';
import { createEmptyArticle, createNewBlog, createNewPage } from 'src/app/cms-types/cms-type.factory';
import { CmsAnimal, CmsBlogEntry, CmsPage } from 'sheltify-lib/cms-types';
import { ArticleEditorComponent } from 'src/app/editor/article-editor/article-editor.component';
import { BlogEditorComponent } from 'src/app/editor/blog-editor/blog-editor.component';
import { PageEditorComponent } from 'src/app/editor/page-editor/page-editor.component';
import { TextInputModalComponent } from 'src/app/forms/text-input-modal/text-input-modal.component';
import { BlogService } from 'src/app/services/blog.service';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { ModalService } from 'src/app/services/modal.service';
import { PagesService } from 'src/app/services/pages.service';

@Component({
  selector: 'app-page-list',
  imports: [
    BlogEditorComponent,
  ],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss',
})
export class BlogListComponent {

  constructor(
    public blogService: BlogService,
    private cmsRequestService: CmsRequestService,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    const path = this.activatedRoute.snapshot.paramMap.get('id');
    if(path != null) {
      this.toBlog(path);
    }
  }

  selectedBlog = signal<CmsBlogEntry | null>(null);

  public async newBlog() {
    const blog = createNewBlog();
    blog.Title = await this.modalService.openFinishable(TextInputModalComponent, {label: 'Blogtitel eingeben'}) ?? '';
    await firstValueFrom(this.cmsRequestService.saveBlogEntry(blog));
    this.blogService.reloadBlogs();
  }

  public async toBlog(id: string) {
    const blog = await firstValueFrom(this.cmsRequestService.getBlogEntry(id));
    this.selectedBlog.set(blog);
    this.router.navigate(['/blog', id]);
  }

  public onDeleted() {
    this.blogService.reloadBlogs();
    this.selectedBlog.set(null);
  }
}
