import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location  } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { createNewBlog } from 'src/app/cms-types/cms-type.factory';
import { CmsBlogEntry } from 'sheltify-lib/cms-types';
import { BlogEditorComponent } from 'src/app/editor/blog-editor/blog-editor.component';
import { RadioButtonsInputComponent } from 'src/app/forms/radio-buttons-input/radio-buttons-input.component';
import { TextInputModalComponent } from 'src/app/forms/text-input-modal/text-input-modal.component';
import { LeftSidebarLayoutComponent } from 'src/app/layout/left-sidebar-layout/left-sidebar-layout.component';
import { BlogService } from 'src/app/services/blog.service';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { ModalService } from 'src/app/services/modal.service';
import { TenantConfigurationService } from 'src/app/services/tenant-configuration.service';
import { BtIconComponent } from 'src/app/ui/bt-icon/bt-icon.component';

@Component({
  selector: 'app-page-list',
  imports: [
    BlogEditorComponent,
    BtIconComponent,
    LeftSidebarLayoutComponent,
    RadioButtonsInputComponent,
  ],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss',
})
export class BlogListComponent {

  public blogCategories = signal<string[]>(['alle']);
  public selectedCategory = signal<string>('alle');

  constructor(
    public blogService: BlogService,
    private cmsRequestService: CmsRequestService,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private tenantConfigurationService: TenantConfigurationService,
  ) {
    this.tenantConfigurationService.blogCategories().then(animalKinds => this.blogCategories.set(['alle', ...animalKinds]));
  }

  ngOnInit() {
    const path = this.activatedRoute.snapshot.paramMap.get('id');
    if(path != null) {
      this.toBlog(path);
    }
  }

  selectedBlog = signal<CmsBlogEntry | null>(null);

  public blogs = computed(() => {
    const category = this.selectedCategory();
    return this.blogService.blogs().filter(blog => category === 'alle' || blog.Category === category);
  });

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
