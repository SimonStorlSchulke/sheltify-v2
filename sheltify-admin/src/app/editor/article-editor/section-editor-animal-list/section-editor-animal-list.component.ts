import { Component, Input, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { SectionAnimalList } from 'src/app/cms-types/article-types';
import { NumberInputComponent } from 'src/app/forms/number-input/number-input.component';
import { RangeInputComponent } from 'src/app/forms/range-input/range-input.component';
import { SelectInputComponent } from 'src/app/forms/select-input/select-input.component';

@Component({
  selector: 'app-section-editor-animal-list',
  imports: [
    RangeInputComponent,
    NgOptionComponent,
    NgSelectComponent,
    FormsModule,
    SelectInputComponent,
    NumberInputComponent
  ],
  templateUrl: './section-editor-animal-list.component.html',
  styleUrl: './section-editor-animal-list.component.scss',
})
export class SectionEditorAnimalListComponent {
  section = input.required<SectionAnimalList>();
}
