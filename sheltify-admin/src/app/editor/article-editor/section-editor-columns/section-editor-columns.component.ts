import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { SectionColumns } from 'sheltify-lib/article-types';
import { createEmptySection } from 'src/app/editor/article-editor/article-section.factory';
import { PickNewSectionComponent } from 'src/app/editor/article-editor/pick-new-section/pick-new-section.component';
import { SectionEditorColumnSectionsComponent } from 'src/app/editor/article-editor/section-editor/section-editor-column-sections/section-editor-column-sections.component';
import { SectionEditorComponent } from 'src/app/editor/article-editor/section-editor/section-editor.component';
import { NumberInputComponent } from 'src/app/forms/number-input/number-input.component';
import { AlertService } from 'src/app/services/alert.service';
import { ModalService } from 'src/app/services/modal.service';
import { BtIconComponent } from 'src/app/ui/bt-icon/bt-icon.component';

const maxColumns = 4;

@Component({
  selector: 'app-section-editor-columns',
  imports: [
    NumberInputComponent,
    NgIcon,
    BtIconComponent,
    SectionEditorColumnSectionsComponent,
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

    const sectionType = await this.modalService.openFinishable(PickNewSectionComponent);
    if (!sectionType) return;

    const sectionRef = createEmptySection(sectionType);

    this.section().Content.Columns[columnId].Sections.splice(rowId, 0, sectionRef);

    //setTimeout(() => this.editSectionAtPosition(rowId, 0), 0);
  }
}
