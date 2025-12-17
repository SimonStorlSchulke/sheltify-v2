import { Component, input } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import { CmsArticle } from 'src/app/cms-types/article-types';
import { createEmptyArticle } from 'src/app/cms-types/cms-type.factory';
import { CmsBlogEntry, CmsPage } from 'src/app/cms-types/cms-types';
import { ArticleEditorComponent } from 'src/app/editor/article-editor/article-editor.component';
import { CheckboxInputComponent } from 'src/app/forms/checkbox-input/checkbox-input.component';
import { ImagePickerSingleComponent } from 'src/app/forms/image-picker-single/image-picker-single.component';
import { TextInputComponent } from 'src/app/forms/text-input/text-input.component';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { PagesService } from 'src/app/services/pages.service';

@Component({
  selector: 'app-blog-editor',
  imports: [
    TextInputComponent,
    ArticleEditorComponent,
    CheckboxInputComponent,
    ImagePickerSingleComponent
  ],
  templateUrl: './blog-editor.component.html',
  styleUrl: './blog-editor.component.scss',
})
export class BlogEditorComponent {
  blog = input.required<CmsBlogEntry>();
  saveArticle$ = new Subject<void>();
  constructor(
    private cmsRequestService: CmsRequestService,
    private pagesService: PagesService,
  ) {
  }

  public async save(skipArticle: boolean = false) {
    const page = await firstValueFrom(this.cmsRequestService.saveBlogEntry(this.blog()));
    if(page) {
      if(!skipArticle) {
        this.saveArticle$.next();
      }
      this.pagesService.reloadPages();
    }
  }

  protected async createArticle() {
    const article: CmsArticle = createEmptyArticle();
    const savedArticle = await firstValueFrom(this.cmsRequestService.saveArticle(article));
    this.blog()!.ArticleID = savedArticle.ID;
    this.save(true);
  }
}
