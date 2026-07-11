import { Component, computed, input, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CmsRequestService } from '@app/services/cms-request.service';
import { bootstrapBoxArrowUpRight } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { firstValueFrom, Subject } from 'rxjs';
import { CmsArticle } from 'sheltify-lib/article-types';
import { createEmptyArticle } from '@app/cms-types/cms-type.factory';
import { CmsPage } from 'sheltify-lib/cms-types';
import { ArticleEditorComponent } from '@app/editor/article-editor/article-editor.component';
import { CheckboxInputComponent } from '@app/forms/checkbox-input/checkbox-input.component';
import { NumberInputComponent } from '@app/forms/number-input/number-input.component';
import { TextInputComponent } from '@app/forms/text-input/text-input.component';
import { AlertService } from '@app/services/alert.service';
import { AskSaveService } from '@app/services/ask-save.service';
import { PagesService } from '@app/services/pages.service';
import { TenantConfigurationService } from '@app/services/tenant-configuration.service';
import { BtIconComponent } from '@app/ui/bt-icon/bt-icon.component';
import { LastEditedComponent } from '@app/ui/last-edited/last-edited.component';
import { ManageEntryButtonsComponent } from '@app/ui/manage-entry-buttons/manage-entry-buttons.component';

@Component({
  selector: 'app-page-editor',
  imports: [
    TextInputComponent,
    ArticleEditorComponent,
    CheckboxInputComponent,
    LastEditedComponent,
    NumberInputComponent,
    BtIconComponent,
    ManageEntryButtonsComponent,
  ],
  providers: [provideIcons({bootstrapBoxArrowUpRight})],
  templateUrl: './page-editor.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './page-editor.component.scss',
})
export class PageEditorComponent {
  tenantConfigurationService = inject(TenantConfigurationService);
  private cmsRequestService = inject(CmsRequestService);
  private pagesService = inject(PagesService);
  private alertService = inject(AlertService);
  private askSaveService = inject(AskSaveService);

  page = input.required<CmsPage>();
  saveArticle$ = new Subject<undefined>();
  deleted = output();

  constructor() {
    this.askSaveService.triggerSave.pipe(takeUntilDestroyed()).subscribe(() => this.save());
  }

  pageUrl = computed(() => {
    let url = this.tenantConfigurationService.config()?.SiteUrl;
    if (!url) return undefined;
    if (!url.endsWith('/')) url += '/';
    console.log(url + this.page().Path)
    return url + this.page().Path;
  });

  async save(skipArticle: boolean = false) {
    this.pagesService.savePage(this.page());
    if (!skipArticle) {
      this.saveArticle$.next(undefined);
    }
  }

  async createArticle() {
    const article: CmsArticle = createEmptyArticle();
    const savedArticle = await firstValueFrom(this.cmsRequestService.saveArticle(article));
    this.page()!.ArticleID = savedArticle.ID;
    this.save(true);
  }

  async togglePublished() {
    const savedPage = await this.pagesService.togglePublished(this.page()!);
    this.page().PublishedAt = savedPage?.PublishedAt;
  }

  async delete() {
    if (!await this.alertService.confirmDelete()) return;
    await firstValueFrom(this.cmsRequestService.deletePages([this.page()!.ID]));
    this.deleted.emit();
  }
}
