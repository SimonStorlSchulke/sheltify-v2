import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { SectionTitle } from 'sheltify-lib/article-types';
import { CheckboxInputComponent } from 'src/app/forms/checkbox-input/checkbox-input.component';
import { TextInputComponent } from 'src/app/forms/text-input/text-input.component';

@Component({
  selector: 'app-section-editor-title',
  imports: [
    TextInputComponent,
    FormsModule,
    NgSelectComponent,
    NgOptionComponent,
    CheckboxInputComponent,
  ],
  templateUrl: './section-editor-title.component.html',
  styleUrl: './section-editor-title.component.scss',
})
export class SectionEditorTitleComponent {
  section = input.required<SectionTitle>();
}
