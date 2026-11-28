import { NgTemplateOutlet } from '@angular/common';
import { Component, DestroyRef, effect, input, OnInit, Renderer2, signal, inject, ChangeDetectionStrategy, ChangeDetectorRef, HostListener, TemplateRef, viewChild } from '@angular/core';
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
import { SectionEditDialog } from '@app/editor/article-editor/section-edit-dialog';
import { loadSectionTempData } from '@app/editor/article-editor/section-temp-data';
import { SectionEditorAllSectionsComponent } from '@app/editor/article-editor/section-editor/section-editor-all-sections/section-editor-all-sections.component';
import { SectionEditorPanelComponent } from '@app/editor/article-editor/section-editor/section-editor-panel/section-editor-panel.component';
import { TextInputComponent } from '@app/forms/text-input/text-input.component';
import { SectionRendererComponent } from '@app/section-renderer/section-renderer.component';
import { AlertService } from '@app/services/alert.service';
import { sectionLabels } from '@app/services/article-renderer';
import { CmsRequestService } from '@app/services/cms-request.service';
import { ModalService } from '@app/services/modal.service';
import { TenantConfigurationService } from '@app/services/tenant-configuration.service';
import { BtIconComponent } from '@app/ui/bt-icon/bt-icon.component';

const copiedToast = 'Sektion kann nun über den "Einfügen" Knopf beim Hover zwischen den Sektionen wieder eingefügt werden (auch in anderen Artikeln).';

@Component({
  selector: 'app-article-editor',
  imports: [
    FormsModule,
    NgTemplateOutlet,
    TextInputComponent,
    BtIconComponent,
    SectionRendererComponent,
    SectionEditorPanelComponent,
    SectionEditorAllSectionsComponent,
  ],
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
  private alertService = inject(AlertService);


  showUpdateNote = input<boolean>(false);

  articleId = input.required<string>();
  saveArticle = input<Observable<{updateNote: string, pushUpdate: boolean} | undefined>>();

  selectedFillColor = signal<string | undefined>(undefined);
  colorPickerExpanded = signal<boolean>(false);

  private readonly sectionDialog = viewChild.required<TemplateRef<unknown>>('sectionDialog');
  readonly editDialog = new SectionEditDialog({
    template: this.sectionDialog,
    findList: () => this.articleEditorService.article()?.Structure.Rows,
    // reload dynamic data: a filter change may still be debounced in the (now destroyed) editor
    afterClose: async section => {
      await loadSectionTempData(section, this.cmsRequestService);
      this.rerenderPreview(section);
    },
  });

  /** Per section counter, bumped to recreate its preview (see template). */
  private readonly previewVersions = new WeakMap<Section, number>();
  private readonly previewVersionsChanged = signal(0);

  constructor() {

    this.tenantConfigurationService.loadTenantStyle(this.renderer);

    effect(async () => {
      const articleId = this.articleId();
      if (!articleId || articleId == '') {
        this.articleEditorService.article.set(createEmptyArticle());
      }
      const article = await lastValueFrom(this.cmsRequestService.getArticle(articleId));
      this.articleEditorService.article.set(article);
      // the previews of dynamic sections (animal lists, ...) need their data - the editors aren't open yet
      article.Structure.Rows.forEach(section => this.loadTempData(section));
    });
  }

  ngOnInit() {
    this.saveArticle()?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((saveOptions) => this.save(saveOptions));
  }

  sectionLabel(section: Section): string {
    if (section.SectionType == 'special') return section.Content.Type;
    return sectionLabels.get(section.SectionType) ?? section.SectionType;
  }

  previewVersion(section: Section): number {
    this.previewVersionsChanged();
    return this.previewVersions.get(section) ?? 0;
  }

  private async loadTempData(section: Section) {
    if (await loadSectionTempData(section, this.cmsRequestService)) this.rerenderPreview(section);
  }

  rerenderPreview(section: Section) {
    this.previewVersions.set(section, (this.previewVersions.get(section) ?? 0) + 1);
    this.previewVersionsChanged.update(v => v + 1);
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
    this.cdRef.markForCheck();
    this.askSaveService.markDirty();
    this.editDialog.open(sectionRef);
  }

  async save(saveOptions: { updateNote: string, pushUpdate: boolean } | undefined) {
    const article = this.articleEditorService.article()!;
    if(saveOptions?.pushUpdate) {
      article.ContentUpdateNote = saveOptions.updateNote;
      article.ContentUpdateAt = SqlNullTimeNow();
    }
    await lastValueFrom(this.cmsRequestService.saveArticle(article));
  }

  @HostListener('document:keydown.escape')
  cancelMoveMode() {
    if (this.articleEditorService.movedItem()) this.articleEditorService.exitMoveMode();
  }

  exitMoveMode() {
    setTimeout(() => {
      this.articleEditorService.exitMoveMode();
    }, 1);
  }

  /** Press the grip of a preview, release on a gap (or click a gap afterwards). */
  startMove(section: Section, event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.articleEditorService.enterMoveMode(section);
  }

  startMoveFromDialog() {
    const section = this.editDialog.edited()?.section;
    if (!section) return;
    this.editDialog.close();
    this.articleEditorService.enterMoveMode(section);
  }

  moveToNewRow(rowTo: number) {
    const article = this.articleEditorService.article();
    if (!article || !this.articleEditorService.movedItem()) return;

    // The moved section may come from the article rows or from inside a columns section.
    if (this.articleEditorService.moveMovedSectionTo(article.Structure.Rows, rowTo)) {
      this.askSaveService.markDirty();
    }
    this.exitMoveMode();
  }

  colorFill(color: string | undefined) {
    this.selectedFillColor.set(color);
    this.askSaveService.markDirty();
  }

  clickSection(section: Section) {
    if (this.articleEditorService.movedItem()) return;
    const selectedColor = this.selectedFillColor();
    if (selectedColor !== undefined) {
      section.BackgroundColor = selectedColor;
      this.selectedFillColor.set(undefined);
    } else {
      this.editDialog.open(section);
    }
  }

  copySection(section: Section | undefined) {
    if (!section) return;
    this.articleEditorService.setCopiedSection(section);
    if (this.editDialog.edited()?.section === section) this.editDialog.close();
    this.alertService.openToast(copiedToast, 'Kopiert');
  }

  cutSection(section: Section | undefined) {
    if (!section) return;
    this.articleEditorService.setCopiedSection(section);
    this.removeSection(section);
    this.alertService.openToast(copiedToast, 'Ausgeschnitten');
  }

  async deleteSection(section: Section | undefined) {
    if (!section) return;
    const answer = await this.alertService.openAlert('Sektion wirklich entfernen?', '', ['nein', 'ja']);
    if (answer !== 'ja') return;
    this.removeSection(section);
  }

  private removeSection(section: Section) {
    if (this.editDialog.edited()?.section === section) {
      this.editDialog.remove();
    } else {
      const rows = this.articleEditorService.article()?.Structure.Rows;
      const index = rows?.indexOf(section) ?? -1;
      if (index >= 0) rows!.splice(index, 1);
    }
    this.askSaveService.markDirty();
  }

  pasteSectionAtRow(event: MouseEvent, row: number) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.articleEditorService.article()) return;
    if (!this.articleEditorService.copiedSection()) return;
    const article = this.articleEditorService.article()!;

    let sectionRef = structuredClone(this.articleEditorService.copiedSection()!);
    article.Structure.Rows.splice(row, 0, sectionRef);
    this.loadTempData(sectionRef);
    this.askSaveService.markDirty();
  }

  readonly sectionLabels = sectionLabels;

  cancelPaste(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.articleEditorService.setCopiedSection(null)
  }
}
