import { Component, input, OnInit, output } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import { CmsArticle } from 'sheltify-lib/article-types';
import { createEmptyArticle } from 'src/app/cms-types/cms-type.factory';
import { CmsBlogEntry } from 'sheltify-lib/cms-types';
import { ArticleEditorComponent } from 'src/app/editor/article-editor/article-editor.component';
import { CheckboxInputComponent } from 'src/app/forms/checkbox-input/checkbox-input.component';
import { ImagePickerSingleComponent } from 'src/app/forms/image-picker-single/image-picker-single.component';
import { SelectInputComponent } from 'src/app/forms/select-input/select-input.component';
import { TextInputComponent } from 'src/app/forms/text-input/text-input.component';
import { AlertService } from 'src/app/services/alert.service';
import { BlogService } from 'src/app/services/blog.service';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { TenantConfigurationService } from 'src/app/services/tenant-configuration.service';
import { LastEditedComponent } from 'src/app/ui/last-edited/last-edited.component';

@Component({
  selector: 'app-blog-editor',
  imports: [
    TextInputComponent,
    ArticleEditorComponent,
    CheckboxInputComponent,
    ImagePickerSingleComponent,
    SelectInputComponent,
    LastEditedComponent
  ],
  templateUrl: './blog-editor.component.html',
  styleUrl: './blog-editor.component.scss',
})
export class BlogEditorComponent implements OnInit {
  blog = input.required<CmsBlogEntry>();
  saveArticle$ = new Subject<void>();
  deleted = output();

  constructor(
    private cmsRequestService: CmsRequestService,
    private blogService: BlogService,
    private alertService: AlertService,
    private tenantConfigurationService: TenantConfigurationService,
  ) {
  }

  blogCategories: string[] = [];

  async ngOnInit() {
    this.blogCategories = await this.tenantConfigurationService.blogCategories();
  }

  public async save(skipArticle: boolean = false) {
    const page = await firstValueFrom(this.cmsRequestService.saveBlogEntry(this.blog()));
    if(page) {
      if(!skipArticle) {
        this.saveArticle$.next();
      }
      this.blogService.reloadBlogs();
    }
  }

  protected async createArticle() {
    const article: CmsArticle = createEmptyArticle();
    const savedArticle = await firstValueFrom(this.cmsRequestService.saveArticle(article));
    this.blog()!.ArticleID = savedArticle.ID;
    this.save(true);
  }

  public async togglePublished() {
    const savedPage = await this.blogService.togglePublished(this.blog()!);
    this.blog().PublishedAt = savedPage?.PublishedAt;
  }

  public async delete() {
    const choice = await this.alertService.openAlert('Eintrag wirklich entfernen?', 'Aktion kann nicht rückgängig gemacht werden', ['ja', 'nein'])
    if (choice !== 'ja') return;

    await firstValueFrom(this.cmsRequestService.deleteBlogEntries([this.blog().ID]));
    this.deleted.emit();
  }
}
