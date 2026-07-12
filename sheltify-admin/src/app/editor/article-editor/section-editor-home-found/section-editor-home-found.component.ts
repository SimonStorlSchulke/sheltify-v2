import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SectionHomeFound } from 'sheltify-lib/article-types';
import { DatePickerComponent } from '@app/forms/date-picker/date-picker.component';

@Component({
  selector: 'app-section-editor-home-found',
  imports: [
    FormsModule,
    DatePickerComponent,
  ],
  templateUrl: './section-editor-home-found.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './section-editor-home-found.component.scss',
})
export class SectionEditorHomeFoundComponent {
  section = input.required<SectionHomeFound>();
}
