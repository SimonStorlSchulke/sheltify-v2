import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { SectionHomeFound } from 'sheltify-lib/article-types';
import { CheckboxInputComponent } from 'src/app/forms/checkbox-input/checkbox-input.component';
import { DatePickerComponent } from 'src/app/forms/date-picker/date-picker.component';
import { TextInputComponent } from 'src/app/forms/text-input/text-input.component';

@Component({
  selector: 'app-section-editor-title',
  imports: [
    TextInputComponent,
    FormsModule,
    NgSelectComponent,
    NgOptionComponent,
    CheckboxInputComponent,
    DatePickerComponent,
  ],
  templateUrl: './section-editor-home-found.component.html',
  styleUrl: './section-editor-home-found.component.scss',
})
export class SectionEditorHomeFoundComponent {
  section = input.required<SectionHomeFound>();
}
