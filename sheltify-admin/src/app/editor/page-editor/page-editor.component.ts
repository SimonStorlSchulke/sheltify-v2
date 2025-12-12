import { Component, input } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import { CmsArticle } from 'src/app/cms-types/article-types';
import { createEmptyArticle } from 'src/app/cms-types/cms-type.factory';
import { CmsPage } from 'src/app/cms-types/cms-types';
import { ArticleEditorComponent } from 'src/app/editor/article-editor/article-editor.component';
import { CheckboxInputComponent } from 'src/app/forms/checkbox-input/checkbox-input.component';
import { TextInputComponent } from 'src/app/forms/text-input/text-input.component';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { PagesService } from 'src/app/services/pages.service';

@Component({
  selector: 'app-page-editor',
  imports: [
    TextInputComponent,
    ArticleEditorComponent,
    CheckboxInputComponent
  ],
  templateUrl: './page-editor.component.html',
  styleUrl: './page-editor.component.scss',
})
export class PageEditorComponent {
  page = input.required<CmsPage>();
  saveArticle$ = new Subject<void>();
  constructor(
    private cmsRequestService: CmsRequestService,
    private pagesService: PagesService,
  ) {
  }

  public async save(skipArticle: boolean = false) {
    const page = await firstValueFrom(this.cmsRequestService.savePage(this.page()));
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
    this.page()!.ArticleID = savedArticle.ID;
    this.save(true);
  }
}
