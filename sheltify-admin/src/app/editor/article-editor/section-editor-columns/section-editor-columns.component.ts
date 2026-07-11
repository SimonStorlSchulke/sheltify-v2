import { Component, input, inject, ChangeDetectionStrategy } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { Section, SectionColumns } from 'sheltify-lib/article-types';
import { createEmptySection } from '@app/editor/article-editor/article-section.factory';
import { PickNewSectionComponent } from '@app/editor/article-editor/pick-new-section/pick-new-section.component';
import { SectionEditorColumnSectionsComponent } from '@app/editor/article-editor/section-editor/section-editor-column-sections/section-editor-column-sections.component';
import { CheckboxInputComponent } from '@app/forms/checkbox-input/checkbox-input.component';
import { NumberInputComponent } from '@app/forms/number-input/number-input.component';
import { AlertService } from '@app/services/alert.service';
import { ModalService } from '@app/services/modal.service';
import { BtIconComponent } from '@app/ui/bt-icon/bt-icon.component';

const maxColumns = 4;

@Component({
  selector: 'app-section-editor-columns',
  imports: [
    NumberInputComponent,
    BtIconComponent,
    SectionEditorColumnSectionsComponent,
    CheckboxInputComponent,
  ],
  templateUrl: './section-editor-columns.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './section-editor-columns.component.scss',
})
export class SectionEditorColumnsComponent {
  private readonly alertService = inject(AlertService);
  private modalService = inject(ModalService);

  section = input.required<SectionColumns>();

  deleteColumn(index: number) {
    this.section().Content.Columns.splice(index, 1);
  }

  deleteSection(iColumn: number, iSection: number) {
    this.section().Content.Columns[iColumn].Sections.splice(iColumn, 1);
  }

  addColumn() {
    if(this.section().Content.Columns.length >= maxColumns){
      this.alertService.openAlert(`Maximal ${maxColumns} Spalten möglich`, '');
      return;
    }
    this.section().Content.Columns.push({
      Sections: [],
      Grow: 1,
    })
  }

  async addSectionAtRow(columnId: number, rowId: number) {

    const sectionPickReturn = await this.modalService.openFinishable(PickNewSectionComponent);
    if (!sectionPickReturn) return;

    let sectionRef: Section;
    if(typeof sectionPickReturn == 'string') {
      sectionRef = createEmptySection(sectionPickReturn);
    } else {
      sectionRef = sectionPickReturn;
    }

    this.section().Content.Columns[columnId].Sections.splice(rowId, 0, sectionRef);

    //setTimeout(() => this.editSectionAtPosition(rowId, 0), 0);
  }

  moveColumnRight(iColumn: number) {
    const columns = this.section().Content.Columns;

    if (iColumn < 0 || iColumn >= columns.length - 1) {
      return;
    }

    [columns[iColumn], columns[iColumn + 1]] = [columns[iColumn + 1], columns[iColumn]];
  }

  moveColumnLeft(iColumn: number) {
    const columns = this.section().Content.Columns;

    if (iColumn <= 0 || iColumn >= columns.length) {
      return;
    }

    [columns[iColumn], columns[iColumn - 1]] = [columns[iColumn - 1], columns[iColumn]];
  }
}
