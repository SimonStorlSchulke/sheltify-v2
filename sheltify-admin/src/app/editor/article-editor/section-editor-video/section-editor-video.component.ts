import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { SectionVideo } from 'sheltify-lib/article-types';
import { TextInputComponent } from '@app/forms/text-input/text-input.component';

@Component({
  selector: 'app-section-editor-video',
  imports: [
    TextInputComponent
  ],
  templateUrl: './section-editor-video.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './section-editor-video.component.scss',
})
export class SectionEditorVideoComponent {
  section = input.required<SectionVideo>();
}
