import { Component, computed, input, model, OnInit, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AskSaveService } from '@app/services/ask-save.service';
import { firstValueFrom, Subject } from 'rxjs';
import { CmsArticle } from 'sheltify-lib/article-types';
import { createEmptyArticle } from '@app/cms-types/cms-type.factory';
import { CmsBlogEntry } from 'sheltify-lib/cms-types';
import { ArticleEditorComponent } from '@app/editor/article-editor/article-editor.component';
import { CheckboxInputComponent } from '@app/forms/checkbox-input/checkbox-input.component';
import { ImagePickerSingleComponent } from '@app/forms/image-picker-single/image-picker-single.component';
import { NumberInputComponent } from '@app/forms/number-input/number-input.component';
import { SelectInputComponent } from '@app/forms/select-input/select-input.component';
import { TextInputComponent } from '@app/forms/text-input/text-input.component';
import { AlertService } from '@app/services/alert.service';
import { BlogService } from '@app/services/blog.service';
import { CmsRequestService } from '@app/services/cms-request.service';
import { TenantConfigurationService } from '@app/services/tenant-configuration.service';
import { BtIconComponent } from '@app/ui/bt-icon/bt-icon.component';
import { LastEditedComponent } from '@app/ui/last-edited/last-edited.component';

@Component({
  selector: 'app-blog-editor',
  imports: [
    TextInputComponent,
    ArticleEditorComponent,
    CheckboxInputComponent,
    ImagePickerSingleComponent,
    SelectInputComponent,
    LastEditedComponent,
    BtIconComponent,
    NumberInputComponent
  ],
  templateUrl: './blog-editor.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './blog-editor.component.scss',
})
export class BlogEditorComponent implements OnInit {
  private cmsRequestService = inject(CmsRequestService);
  private blogService = inject(BlogService);
  private alertService = inject(AlertService);
  private tenantConfigurationService = inject(TenantConfigurationService);
  private askSaveService = inject(AskSaveService);

  blog = model.required<CmsBlogEntry>();
  saveArticle$ = new Subject<undefined>();
  deleted = output();

  blogCategories: string[] = [];

  constructor() {
    this.askSaveService.triggerSave$.pipe(takeUntilDestroyed()).subscribe(() => this.save())
  }


  async ngOnInit() {
    this.blogCategories = await this.tenantConfigurationService.blogCategories();
  }

  link = computed(() => {
    let url = this.tenantConfigurationService.config()?.SiteUrl;
    if (!url || this.blog().PublishedAt?.Valid == false) return undefined;

    if (!url.endsWith('/')) url += '/';

    const title = this.blog().Title;
    const encodedTitle = title
      .replace(/~/g, "~t")
      .replace(/\?/g, "~q")
      .replace(/\//g, "~s")
      .replace(/%/g, "~p")
      .replace(/\s+/g, "-");

    return `${url}blog/${encodedTitle}`;
  });

  async save(skipArticle: boolean = false) {
    const page = await firstValueFrom(this.cmsRequestService.saveBlogEntry(this.blog()));
    if(page) {
      if(!skipArticle) {
        this.saveArticle$.next(undefined);
      }
      this.blogService.reloadBlogs();
    }
  }

  async createArticle() {
    const article: CmsArticle = createEmptyArticle();
    const savedArticle = await firstValueFrom(this.cmsRequestService.saveArticle(article));
    this.blog()!.ArticleID = savedArticle.ID;
    this.save(true);
  }

  async togglePublished() {
    const savedPage = await this.blogService.togglePublished(this.blog()!);
    this.blog.update(blog => {
      blog.PublishedAt = savedPage?.PublishedAt
      return structuredClone(blog)
    });
  }

  async delete() {
    if (!await this.alertService.confirmDelete()) return;
    await firstValueFrom(this.cmsRequestService.deleteBlogEntries([this.blog().ID]));
    this.deleted.emit();
  }
}
