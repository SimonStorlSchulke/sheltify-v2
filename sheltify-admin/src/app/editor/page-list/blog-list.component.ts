import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location  } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { createNewBlog } from 'src/app/cms-types/cms-type.factory';
import { CmsBlogEntry } from 'sheltify-lib/cms-types';
import { BlogEditorComponent } from 'src/app/editor/blog-editor/blog-editor.component';
import { TextInputModalComponent } from 'src/app/forms/text-input-modal/text-input-modal.component';
import { LeftSidebarLayoutComponent } from 'src/app/layout/left-sidebar-layout/left-sidebar-layout.component';
import { BlogService } from 'src/app/services/blog.service';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { ModalService } from 'src/app/services/modal.service';
import { BtIconComponent } from 'src/app/ui/bt-icon/bt-icon.component';

@Component({
  selector: 'app-page-list',
  imports: [
    BlogEditorComponent,
    BtIconComponent,
    LeftSidebarLayoutComponent,
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
    private location: Location,
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
    const savedBlog = await firstValueFrom(this.cmsRequestService.saveBlogEntry(blog));
    this.toBlog(savedBlog.ID)
    this.blogService.reloadBlogs();
  }

  public async toBlog(id: string) {
    const blog = await firstValueFrom(this.cmsRequestService.getBlogEntry(id));
    this.selectedBlog.set(blog);
    this.location.go('/blog/' + id);
  }

  public onDeleted() {
    this.blogService.reloadBlogs();
    this.selectedBlog.set(null);
  }
}
