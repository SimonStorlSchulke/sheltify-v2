import { Component, DestroyRef, effect, input, model, OnInit, Renderer2, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { bootstrapGripVertical, bootstrapX, bootstrapPlus } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lastValueFrom, Observable } from 'rxjs';
import { SqlNullTimeNow } from 'sheltify-lib/cms-types';
import { Section } from 'sheltify-lib/dist/article-types';
import { createEmptyArticle } from 'src/app/cms-types/cms-type.factory';
import { ArticleEditorService } from 'src/app/editor/article-editor/article-editor.service';
import { createEmptySection } from 'src/app/editor/article-editor/article-section.factory';
import { PickNewSectionComponent } from 'src/app/editor/article-editor/pick-new-section/pick-new-section.component';
import { SectionEditorComponent } from 'src/app/editor/article-editor/section-editor/section-editor.component';
import { TextInputComponent } from 'src/app/forms/text-input/text-input.component';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { ModalService } from 'src/app/services/modal.service';
import { bootstrapEye } from '@ng-icons/bootstrap-icons';
import { TenantConfigurationService } from 'src/app/services/tenant-configuration.service';
import { BtIconComponent } from 'src/app/ui/bt-icon/bt-icon.component';

@Component({
  selector: 'app-article-editor',
  imports: [NgIcon, FormsModule, SectionEditorComponent, TextInputComponent, BtIconComponent],
  providers: [provideIcons({bootstrapGripVertical, bootstrapX, bootstrapPlus, bootstrapEye})],
  templateUrl: './article-editor.component.html',
  styleUrl: './article-editor.component.scss',
})
export class ArticleEditorComponent implements OnInit {

  public showUpdateNote = input<boolean>(false);

  public articleId = input.required<string>();
  public saveArticle = input<Observable<{updateNote: string, pushUpdate: boolean} | undefined>>();
  public isPreviewMode = signal<boolean>(false);

  public selectedFillColor = signal<string | undefined>(undefined);
  public editedRow = model<number | undefined>(undefined);
  public colorPickerExpanded = signal<boolean>(false);


  constructor(
    public articleEditorService: ArticleEditorService,
    private modalService: ModalService,
    private cmsRequestService: CmsRequestService,
    private renderer: Renderer2,
    private destroyRef: DestroyRef,
    private tenantConfigurationService: TenantConfigurationService,
  ) {

    this.tenantConfigurationService.siteUrl().then(siteUrl => siteUrl ? this.addGlobalStyle(siteUrl + 'provided-article-theme.css') : false);

    effect(async () => {
      const articleId = this.articleId();
      if (!articleId || articleId == '') {
        this.articleEditorService.article.set(createEmptyArticle());
      }
      const article = await lastValueFrom(this.cmsRequestService.getArticle(articleId));
      this.articleEditorService.article.set(article);
    });
  }

  ngOnInit() {
    this.saveArticle()?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((saveOptions) => this.save(saveOptions));
  }

  public async addSectionAtRow(row: number) {
    if (!this.articleEditorService.article() || this.isPreviewMode()) return;
    if (this.articleEditorService.movedItem()) return;
    const article = this.articleEditorService.article()!;

    const sectionType = await this.modalService.openFinishable(PickNewSectionComponent);
    if (!sectionType) return;

    const sectionRef = createEmptySection(sectionType);

    article.Structure.Rows.splice(row, 0, sectionRef);

    this.exitMoveMode();
    this.editedRow.set(row);
  }

  private addGlobalStyle(css: string) {
    const link = document.createElement( "link" );
    link.href = css;
    link.type = "text/css";
    link.rel = "stylesheet";

    this.renderer.appendChild(document.head, link);
  }

  public async save(saveOptions: { updateNote: string, pushUpdate: boolean } | undefined) {
    const article = this.articleEditorService.article()!;
    if(saveOptions?.pushUpdate) {
      article.ContentUpdateNote = saveOptions.updateNote;
      article.ContentUpdateAt = SqlNullTimeNow();
    }
    await lastValueFrom(this.cmsRequestService.saveArticle(article));
  }

  public exitMoveMode() {
    setTimeout(() => {
      this.articleEditorService.exitMoveMode();
    });
  }

  public moveToNewRow(rowTo: number) {
    if (!this.articleEditorService.article()) return;
    const movedItem = this.articleEditorService.movedItem();
    if (!movedItem) return;
    const article = this.articleEditorService.article()!;

    let rowFrom = this.articleEditorService.movedItem()!.row;

    if (rowFrom < rowTo) {
      rowTo--;
    }

    article.Structure.Rows.splice(rowFrom, 1);
    article.Structure.Rows.splice(rowTo, 0, movedItem.sectionRef);
    this.exitMoveMode();
  }

  public colorFill(color: string | undefined) {
    this.selectedFillColor.set(color);
  }

  protected clickSection(section: Section, row: number) {
    const selectedColor = this.selectedFillColor();
    if (selectedColor !== undefined) {
      section.BackgroundColor = selectedColor;
      this.selectedFillColor.set(undefined);
    } else {
      // wrap in timeout so the deselect in section-editor.component doesn't trigger after the select
      setTimeout(() => this.editedRow.set(row), 0);
    }
  }
}
