import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { createNewBlog } from '@app/cms-types/cms-type.factory';
import { BlogEditorComponent } from '@app/editor/blog-editor/blog-editor.component';
import { RadioButtonsInputComponent } from '@app/forms/radio-buttons-input/radio-buttons-input.component';
import { TextInputModalComponent } from '@app/forms/text-input-modal/text-input-modal.component';
import { LeftSidebarLayoutComponent } from '@app/layout/left-sidebar-layout/left-sidebar-layout.component';
import { BlogService } from '@app/services/blog.service';
import { CmsRequestService } from '@app/services/cms-request.service';
import { ModalService } from '@app/services/modal.service';
import { TenantConfigurationService } from '@app/services/tenant-configuration.service';
import { BtIconComponent } from '@app/ui/bt-icon/bt-icon.component';
import { firstValueFrom } from 'rxjs';
import { CmsBlogEntry } from 'sheltify-lib/cms-types';


export const blogResolver: ResolveFn<CmsBlogEntry> = (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id')!;
  return inject(CmsRequestService).getBlogEntry(id);
}

@Component({
  selector: 'app-page-list',
  imports: [
    BlogEditorComponent,
    BtIconComponent,
    LeftSidebarLayoutComponent,
    RadioButtonsInputComponent,
  ],
  templateUrl: './blog-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './blog-list.component.scss',
})
export class BlogListComponent {
  blogService = inject(BlogService);
  private cmsRequestService = inject(CmsRequestService);
  private modalService = inject(ModalService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private tenantConfigurationService = inject(TenantConfigurationService);

  public blogCategories = signal<string[]>(['alle']);
  public selectedCategory = signal<string>('alle');

  constructor() {
    this.activatedRoute.data.pipe(takeUntilDestroyed()).subscribe(({blog}) => this.selectedBlog.set(blog));
    this.tenantConfigurationService.blogCategories().then(animalKinds => this.blogCategories.set(['alle', ...animalKinds]));
  }

  selectedBlog = signal<CmsBlogEntry | null>(null);

  blogs = computed(() => {
    const category = this.selectedCategory();
    return this.blogService.blogs().filter(blog => category === 'alle' || blog.Category === category);
  });

  async newBlog() {
    const blog = createNewBlog();
    blog.Title = await this.modalService.openFinishable(TextInputModalComponent, {label: 'Blogtitel eingeben'}) ?? '';
    const savedBlog = await firstValueFrom(this.cmsRequestService.saveBlogEntry(blog));
    this.toBlog(savedBlog.ID)
    this.blogService.reloadBlogs();
  }

  async toBlog(id: string) {
    await this.router.navigate(['blog', id]);
  }

  onDeleted() {
    this.blogService.reloadBlogs();
    this.selectedBlog.set(null);
  }
}
