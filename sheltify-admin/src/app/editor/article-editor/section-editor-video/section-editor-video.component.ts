import { Component, input } from '@angular/core';
import { SectionVideo } from 'sheltify-lib/article-types';
import { TextInputComponent } from 'src/app/forms/text-input/text-input.component';

@Component({
  selector: 'app-section-editor-video',
  imports: [
    TextInputComponent
  ],
  templateUrl: './section-editor-video.component.html',
  styleUrl: './section-editor-video.component.scss',
})
export class SectionEditorVideoComponent {
  section = input.required<SectionVideo>();
}
