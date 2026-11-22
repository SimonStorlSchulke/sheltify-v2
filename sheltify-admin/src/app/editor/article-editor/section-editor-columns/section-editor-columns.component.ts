import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, input, inject, ChangeDetectionStrategy, signal, DestroyRef, TemplateRef, viewChild, ViewContainerRef } from '@angular/core';
import { SectionRendererComponent } from '@app/section-renderer/section-renderer.component';
import { Section, SectionColumns } from 'sheltify-lib/article-types';
import { ArticleEditorService, typesNotAllowedInColumns } from '@app/editor/article-editor/article-editor.service';
import { createEmptySection } from '@app/editor/article-editor/article-section.factory';
import { AskSaveService } from '@app/services/ask-save.service';
import { PickNewSectionComponent } from '@app/editor/article-editor/pick-new-section/pick-new-section.component';
import { SectionEditorColumnSectionsComponent } from '@app/editor/article-editor/section-editor/section-editor-column-sections/section-editor-column-sections.component';
import { CheckboxInputComponent } from '@app/forms/checkbox-input/checkbox-input.component';
import { AlertService } from '@app/services/alert.service';
import { ModalService } from '@app/services/modal.service';
import { BtIconComponent } from '@app/ui/bt-icon/bt-icon.component';

const maxColumns = 4;
const maxGrow = 12;

/** Common column ratios offered in the toolbar, by number of columns. */
const layoutPresets: Record<number, number[][]> = {
  2: [[1, 1], [2, 1], [1, 2], [3, 1], [1, 3]],
  3: [[1, 1, 1], [2, 1, 1], [1, 2, 1], [1, 1, 2]],
  4: [[1, 1, 1, 1], [2, 1, 1, 2], [1, 2, 2, 1]],
};

interface EditedSection {
  section: Section;
  /** State before editing started, restored on "Verwerfen". */
  snapshot: Section;
  /** Section was just added - "Verwerfen" removes it again. */
  isNew: boolean;
}

@Component({
  selector: 'app-section-editor-columns',
  imports: [
    BtIconComponent,
    SectionEditorColumnSectionsComponent,
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

  section = input.required<SectionColumns>();
  editedSection = signal<EditedSection | undefined>(undefined);

  /** Bumped to recreate the column previews after editing (see template). */
  previewVersion = signal(0);

  private readonly dialog = inject(Dialog);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly sectionDialog = viewChild.required<TemplateRef<unknown>>('sectionDialog');
  private dialogRef?: DialogRef<unknown, unknown>;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.dialogRef?.close());
  }

  readonly maxGrow = maxGrow;

  presets(): number[][] {
    return layoutPresets[this.section().Content.Columns.length] ?? [];
  }

  isActivePreset(preset: number[]): boolean {
    const grows = this.section().Content.Columns.map(col => col.Grow || 0);
    // Same ratio, e.g. [2, 4] matches [1, 2]
    return grows.length === preset.length && grows.every((grow, i) => grow * preset[0] === preset[i] * grows[0]);
  }

  applyPreset(preset: number[]) {
    this.section().Content.Columns.forEach((col, i) => col.Grow = preset[i]);
    this.askSaveService.markDirty();
  }

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
    const edited = this.editedSection();
    if (edited && column.Sections.includes(edited.section)) {
      this.closeEditor();
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
    const section = this.editedSection()?.section;
    if (!section) return;
    this.closeEditor();
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
    this.openEditor(sectionRef, true);
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
    if (this.editedSection()?.section === section) return;
    this.openEditor(section, false);
  }

  private openEditor(section: Section, isNew: boolean) {
    this.editedSection.set({ section, snapshot: structuredClone(section), isNew });
    if (this.dialogRef) return;

    this.dialogRef = this.dialog.open(this.sectionDialog(), {
      panelClass: 'modal-mobile-fullscreen',
      viewContainerRef: this.viewContainerRef,
      autoFocus: 'dialog',
      ariaLabel: 'Sektion bearbeiten',
    });
    // Esc and backdrop click close the dialog and keep the (live applied) changes.
    this.dialogRef.closed.subscribe(() => {
      this.dialogRef = undefined;
      if (this.editedSection()) this.closeEditor();
    });
  }

  closeEditor() {
    this.editedSection.set(undefined);
    this.previewVersion.update(v => v + 1);
    this.dialogRef?.close();
  }

  discardEdit() {
    const edited = this.editedSection();
    if (!edited) return;
    const position = this.findSection(edited.section);
    if (position) {
      const sections = this.section().Content.Columns[position.iCol].Sections;
      if (edited.isNew) {
        sections.splice(position.iRow, 1);
      } else {
        sections[position.iRow] = edited.snapshot;
      }
    }
    this.closeEditor();
  }

  async deleteEditedSection() {
    const edited = this.editedSection();
    if (!edited) return;
    const answer = await this.alertService.openAlert('Sektion wirklich entfernen?', '', ['nein', 'ja']);
    if (answer !== 'ja') return;
    const position = this.findSection(edited.section);
    if (position) {
      this.section().Content.Columns[position.iCol].Sections.splice(position.iRow, 1);
    }
    this.closeEditor();
  }

  private findSection(section: Section): { iCol: number, iRow: number } | undefined {
    const columns = this.section().Content.Columns;
    for (let iCol = 0; iCol < columns.length; iCol++) {
      const iRow = columns[iCol].Sections.indexOf(section);
      if (iRow >= 0) return { iCol, iRow };
    }
    return undefined;
  }
}
