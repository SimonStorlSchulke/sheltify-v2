import { Component, DestroyRef, effect, input, model, OnInit, Renderer2, signal, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { AskSaveService } from '@app/services/ask-save.service';
import { bootstrapEye, bootstrapGripVertical, bootstrapPlus, bootstrapX } from '@ng-icons/bootstrap-icons';
import { provideIcons } from '@ng-icons/core';
import { lastValueFrom, Observable } from 'rxjs';
import { SqlNullTimeNow } from 'sheltify-lib/cms-types';
import { Section } from 'sheltify-lib/dist/article-types';
import { createEmptyArticle } from '@app/cms-types/cms-type.factory';
import { ArticleEditorService } from '@app/editor/article-editor/article-editor.service';
import { createEmptySection } from '@app/editor/article-editor/article-section.factory';
import { PickNewSectionComponent } from '@app/editor/article-editor/pick-new-section/pick-new-section.component';
import { SectionEditorComponent } from '@app/editor/article-editor/section-editor/section-editor.component';
import { TextInputComponent } from '@app/forms/text-input/text-input.component';
import { sectionLabels } from '@app/services/article-renderer';
import { CmsRequestService } from '@app/services/cms-request.service';
import { ModalService } from '@app/services/modal.service';
import { TenantConfigurationService } from '@app/services/tenant-configuration.service';
import { BtIconComponent } from '@app/ui/bt-icon/bt-icon.component';

@Component({
  selector: 'app-article-editor',
  imports: [FormsModule, SectionEditorComponent, TextInputComponent, BtIconComponent],
  providers: [provideIcons({bootstrapGripVertical, bootstrapX, bootstrapPlus, bootstrapEye})],
  templateUrl: './article-editor.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './article-editor.component.scss',
})
export class ArticleEditorComponent implements OnInit {
  articleEditorService = inject(ArticleEditorService);
  private modalService = inject(ModalService);
  private cmsRequestService = inject(CmsRequestService);
  private renderer = inject(Renderer2);
  private destroyRef = inject(DestroyRef);
  private tenantConfigurationService = inject(TenantConfigurationService);
  private cdRef = inject(ChangeDetectorRef);
  private askSaveService = inject(AskSaveService);


  showUpdateNote = input<boolean>(false);

  articleId = input.required<string>();
  saveArticle = input<Observable<{updateNote: string, pushUpdate: boolean} | undefined>>();

  selectedFillColor = signal<string | undefined>(undefined);
  editedRow = model<number | undefined>(undefined);
  colorPickerExpanded = signal<boolean>(false);


  constructor() {

    this.tenantConfigurationService.providedArticleThemeUrl().then(url => url ? this.addGlobalStyle(url) : false);

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

  async addSectionAtRow(row: number) {
    if (!this.articleEditorService.article()) return;
    if (this.articleEditorService.movedItem()) return;
    const article = this.articleEditorService.article()!;

    const sectionPickReturn = await this.modalService.openFinishable(PickNewSectionComponent);
    if (!sectionPickReturn) return;

    let sectionRef: Section;
    if(typeof sectionPickReturn == 'string') {
      sectionRef = createEmptySection(sectionPickReturn);
    } else {
      sectionRef = sectionPickReturn;
    }

    article.Structure.Rows.splice(row, 0, sectionRef);

    this.exitMoveMode();
    this.editedRow.set(row);
    this.cdRef.markForCheck();
    this.askSaveService.markDirty();
  }

  private addGlobalStyle(css: string) {
    const link = document.createElement( "link" );
    link.href = css;
    link.type = "text/css";
    link.rel = "stylesheet";

    this.renderer.appendChild(document.head, link);
  }

  async save(saveOptions: { updateNote: string, pushUpdate: boolean } | undefined) {
    const article = this.articleEditorService.article()!;
    if(saveOptions?.pushUpdate) {
      article.ContentUpdateNote = saveOptions.updateNote;
      article.ContentUpdateAt = SqlNullTimeNow();
    }
    await lastValueFrom(this.cmsRequestService.saveArticle(article));
  }

  exitMoveMode() {
    setTimeout(() => {
      this.articleEditorService.exitMoveMode();
    }, 1);
  }

  moveToNewRow(rowTo: number) {
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
    this.askSaveService.markDirty();
  }

  colorFill(color: string | undefined) {
    this.selectedFillColor.set(color);
    this.askSaveService.markDirty();
  }

  clickSection(section: Section, row: number) {
    const selectedColor = this.selectedFillColor();
    if (selectedColor !== undefined) {
      section.BackgroundColor = selectedColor;
      this.selectedFillColor.set(undefined);
    } else {
      // wrap in timeout so the deselect in section-editor.component doesn't trigger after the select
      setTimeout(() => this.editedRow.set(row), 0);
    }
  }

  pasteSectionAtRow(event: MouseEvent, row: number) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.articleEditorService.article()) return;
    if (!this.articleEditorService.copiedSection()) return;
    const article = this.articleEditorService.article()!;

    let sectionRef = structuredClone(this.articleEditorService.copiedSection()!);
    article.Structure.Rows.splice(row, 0, sectionRef);
    this.askSaveService.markDirty();
  }

  readonly sectionLabels = sectionLabels;

  cancelPaste(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.articleEditorService.copiedSection.set(null)
  }
}
