import { Component, input, inject, ChangeDetectionStrategy, signal, TemplateRef, viewChild } from '@angular/core';
import { SectionRendererComponent } from '@app/section-renderer/section-renderer.component';
import { Section, SectionColumns } from 'sheltify-lib/article-types';
import { ArticleEditorService, typesNotAllowedInColumns } from '@app/editor/article-editor/article-editor.service';
import { createEmptySection } from '@app/editor/article-editor/article-section.factory';
import { SectionEditDialog } from '@app/editor/article-editor/section-edit-dialog';
import { SectionEditorPanelComponent } from '@app/editor/article-editor/section-editor/section-editor-panel/section-editor-panel.component';
import { AskSaveService } from '@app/services/ask-save.service';
import { PickNewSectionComponent } from '@app/editor/article-editor/pick-new-section/pick-new-section.component';
import { SectionEditorColumnSectionsComponent } from '@app/editor/article-editor/section-editor/section-editor-column-sections/section-editor-column-sections.component';
import { CheckboxInputComponent } from '@app/forms/checkbox-input/checkbox-input.component';
import { AlertService } from '@app/services/alert.service';
import { ModalService } from '@app/services/modal.service';
import { BtIconComponent } from '@app/ui/bt-icon/bt-icon.component';
import { sectionLabels } from '@app/services/article-renderer';

const maxColumns = 4;
const maxGrow = 12;

@Component({
  selector: 'app-section-editor-columns',
  imports: [
    BtIconComponent,
    SectionEditorColumnSectionsComponent,
    SectionEditorPanelComponent,
    CheckboxInputComponent,
    SectionRendererComponent,
  ],
  templateUrl: './section-editor-columns.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './section-editor-columns.component.scss',
})
export class SectionEditorColumnsComponent {
  private readonly alertService = inject(AlertService);
  private modalService = inject(ModalService);
  private askSaveService = inject(AskSaveService);
  readonly articleEditorService = inject(ArticleEditorService);

  readonly maxColumns = maxColumns;
  readonly sectionLabels = sectionLabels;

  section = input.required<SectionColumns>();

  /** Bumped to recreate the column previews after editing (see template). */
  previewVersion = signal(0);

  private readonly sectionDialog = viewChild.required<TemplateRef<unknown>>('sectionDialog');
  readonly editDialog = new SectionEditDialog({
    template: this.sectionDialog,
    findList: section => this.section().Content.Columns.find(column => column.Sections.includes(section))?.Sections,
    afterClose: () => this.previewVersion.update(v => v + 1),
  });

  readonly maxGrow = maxGrow;

  changeGrow(iCol: number, delta: number) {
    const column = this.section().Content.Columns[iCol];
    column.Grow = Math.min(maxGrow, Math.max(1, Math.round(column.Grow || 1) + delta));
    this.askSaveService.markDirty();
  }

  /** Grid columns matching the real column ratios, e.g. "minmax(0, 2fr) minmax(0, 5fr)". */
  gridTemplate(): string {
    return this.section().Content.Columns.map(col => `minmax(0, ${col.Grow || 1}fr)`).join(' ') || '1fr';
  }

  widthPercent(grow: number): number {
    const total = this.section().Content.Columns.reduce((sum, col) => sum + (col.Grow || 0), 0);
    return total > 0 ? Math.round((grow || 0) / total * 100) : 0;
  }

  async deleteColumn(iCol: number) {
    const column = this.section().Content.Columns[iCol];
    if (column.Sections.length > 0) {
      const answer = await this.alertService.openAlert(
        'Spalte wirklich entfernen?',
        `Die Spalte enthält ${column.Sections.length} Sektion(en), die ebenfalls entfernt werden.`,
        ['nein', 'ja'],
      );
      if (answer !== 'ja') return;
    }
    const edited = this.editDialog.edited();
    if (edited && column.Sections.includes(edited.section)) {
      this.editDialog.close();
    }
    this.section().Content.Columns.splice(iCol, 1);
    this.askSaveService.markDirty();
  }

  addColumn() {
    if (this.section().Content.Columns.length >= maxColumns) {
      this.alertService.openAlert(`Maximal ${maxColumns} Spalten möglich`, '');
      return;
    }
    this.section().Content.Columns.push({
      Sections: [],
      Grow: 1,
    });
    this.askSaveService.markDirty();
  }

  /** Same principle as for top level sections: press "verschieben", release on a gap. */
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

  moveToColumnRow(iCol: number, iRow: number) {
    if (!this.articleEditorService.movedItem()) return;
    const target = this.section().Content.Columns[iCol].Sections;
    if (this.articleEditorService.moveMovedSectionTo(target, iRow, this.section())) {
      this.askSaveService.markDirty();
    }
    // timeout so the click following this mouseup doesn't open the section picker
    setTimeout(() => this.articleEditorService.exitMoveMode(), 1);
  }

  async addSectionAtRow(iCol: number, iRow: number) {
    if (this.articleEditorService.movedItem()) return;
    const sectionPickReturn = await this.modalService.openFinishable(PickNewSectionComponent, {
      excludedTypes: typesNotAllowedInColumns,
    });
    if (!sectionPickReturn) return;

    const sectionRef: Section = typeof sectionPickReturn == 'string'
      ? createEmptySection(sectionPickReturn)
      : sectionPickReturn;

    this.section().Content.Columns[iCol].Sections.splice(iRow, 0, sectionRef);
    this.askSaveService.markDirty();
    this.editDialog.open(sectionRef, true);
  }

  moveColumn(iColumn: number, direction: -1 | 1) {
    const columns = this.section().Content.Columns;
    const target = iColumn + direction;
    if (target < 0 || target >= columns.length) return;
    [columns[iColumn], columns[target]] = [columns[target], columns[iColumn]];
    this.askSaveService.markDirty();
  }

  editSection(section: Section) {
    if (this.articleEditorService.movedItem()) return;
    this.editDialog.open(section);
  }

  async deleteEditedSection() {
    const answer = await this.alertService.openAlert('Sektion wirklich entfernen?', '', ['nein', 'ja']);
    if (answer !== 'ja') return;
    this.editDialog.remove();
    this.askSaveService.markDirty();
  }
}
