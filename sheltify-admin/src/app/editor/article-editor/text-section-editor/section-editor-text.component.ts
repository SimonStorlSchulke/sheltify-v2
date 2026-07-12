import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { SectionText } from 'sheltify-lib/article-types';
import { TextEditorComponent } from '@app/editor/text-editor/text-editor.component';

@Component({
  selector: 'app-section-editor-text',
  imports: [
    TextEditorComponent
  ],
  templateUrl: './section-editor-text.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './section-editor-text.component.scss'
})
export class SectionEditorTextComponent {
  section = input.required<SectionText>();

  html = output<SectionText>();

  onInput(value: string) {
    this.section().Content.Html = value;
  }
}
