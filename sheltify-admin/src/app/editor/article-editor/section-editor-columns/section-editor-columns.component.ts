import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { Section, SectionColumns } from 'sheltify-lib/article-types';
import { createEmptySection } from 'src/app/editor/article-editor/article-section.factory';
import { PickNewSectionComponent } from 'src/app/editor/article-editor/pick-new-section/pick-new-section.component';
import { SectionEditorColumnSectionsComponent } from 'src/app/editor/article-editor/section-editor/section-editor-column-sections/section-editor-column-sections.component';
import { CheckboxInputComponent } from 'src/app/forms/checkbox-input/checkbox-input.component';
import { NumberInputComponent } from 'src/app/forms/number-input/number-input.component';
import { AlertService } from 'src/app/services/alert.service';
import { ModalService } from 'src/app/services/modal.service';
import { BtIconComponent } from 'src/app/ui/bt-icon/bt-icon.component';

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
  styleUrl: './section-editor-columns.component.scss',
})
export class SectionEditorColumnsComponent {
  public section = input.required<SectionColumns>();

  constructor(private readonly alertService: AlertService, private modalService: ModalService) {
  }

  public deleteColumn(index: number) {
    this.section().Content.Columns.splice(index, 1);
  }

  public deleteSection(iColumn: number, iSection: number) {
    this.section().Content.Columns[iColumn].Sections.splice(iColumn, 1);
  }

  public addColumn() {
    if(this.section().Content.Columns.length >= maxColumns){
      this.alertService.openAlert(`Maximal ${maxColumns} Spalten möglich`, '');
      return;
    }
    this.section().Content.Columns.push({
      Sections: [],
      Grow: 1,
    })
  }

  public async addSectionAtRow(columnId: number, rowId: number) {

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

  protected moveColumnRight(iColumn: number) {
    const columns = this.section().Content.Columns;

    if (iColumn < 0 || iColumn >= columns.length - 1) {
      return;
    }

    [columns[iColumn], columns[iColumn + 1]] = [columns[iColumn + 1], columns[iColumn]];
  }

  protected moveColumnLeft(iColumn: number) {
    const columns = this.section().Content.Columns;

    if (iColumn <= 0 || iColumn >= columns.length) {
      return;
    }

    [columns[iColumn], columns[iColumn - 1]] = [columns[iColumn - 1], columns[iColumn]];
  }
}
