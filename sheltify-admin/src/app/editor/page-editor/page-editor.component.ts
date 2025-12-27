import { Component, computed, input, output } from '@angular/core';
import { bootstrapBoxArrowUpRight } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { firstValueFrom, Subject } from 'rxjs';
import { CmsArticle } from 'sheltify-lib/article-types';
import { createEmptyArticle } from 'src/app/cms-types/cms-type.factory';
import { CmsPage } from 'sheltify-lib/cms-types';
import { ArticleEditorComponent } from 'src/app/editor/article-editor/article-editor.component';
import { CheckboxInputComponent } from 'src/app/forms/checkbox-input/checkbox-input.component';
import { NumberInputComponent } from 'src/app/forms/number-input/number-input.component';
import { TextInputComponent } from 'src/app/forms/text-input/text-input.component';
import { AlertService } from 'src/app/services/alert.service';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { PagesService } from 'src/app/services/pages.service';
import { TenantConfigurationService } from 'src/app/services/tenant-configuration.service';
import { BtIconComponent } from 'src/app/ui/bt-icon/bt-icon.component';
import { LastEditedComponent } from 'src/app/ui/last-edited/last-edited.component';

@Component({
  selector: 'app-page-editor',
  imports: [
    TextInputComponent,
    ArticleEditorComponent,
    CheckboxInputComponent,
    LastEditedComponent,
    NumberInputComponent,
    NgIcon,
    BtIconComponent,
  ],
  providers: [provideIcons({bootstrapBoxArrowUpRight})],
  templateUrl: './page-editor.component.html',
  styleUrl: './page-editor.component.scss',
})
export class PageEditorComponent {
  page = input.required<CmsPage>();
  saveArticle$ = new Subject<void>();
  deleted = output();

  constructor(
    public tenantConfigurationService: TenantConfigurationService,
    private cmsRequestService: CmsRequestService,
    private pagesService: PagesService,
    private alertService: AlertService,
  ) {
  }

  public pageUrl = computed(() => {
    let url = this.tenantConfigurationService.config()?.SiteUrl;
    if (!url) return undefined;
    if (!url.endsWith('/')) url += '/';
    console.log(url + this.page().Path)
    return url + this.page().Path;
  });

  public async save(skipArticle: boolean = false) {
    this.pagesService.savePage(this.page());
    if (!skipArticle) {
      this.saveArticle$.next();
    }
  }

  protected async createArticle() {
    const article: CmsArticle = createEmptyArticle();
    const savedArticle = await firstValueFrom(this.cmsRequestService.saveArticle(article));
    this.page()!.ArticleID = savedArticle.ID;
    this.save(true);
  }

  async togglePublished() {
    const savedPage = await this.pagesService.togglePublished(this.page()!);
    this.page().PublishedAt = savedPage?.PublishedAt;
  }

  public async delete() {
    const choice = await this.alertService.openAlert('Seite wirklich entfernen?', 'Aktion kann nicht rückgängig gemacht werden', ['ja', 'nein'])
    if (choice !== 'ja') return;

    await firstValueFrom(this.cmsRequestService.deletePages([this.page()!.ID]));
    this.deleted.emit();
  }
}
