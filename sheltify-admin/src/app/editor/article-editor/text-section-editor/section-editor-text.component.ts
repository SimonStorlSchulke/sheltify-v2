import { Component, input, output } from '@angular/core';
import { SectionText } from 'src/app/cms-types/article-types';
import { TextEditorComponent } from 'src/app/editor/text-editor/text-editor.component';

@Component({
  selector: 'app-section-editor-text',
  imports: [
    TextEditorComponent
  ],
  templateUrl: './section-editor-text.component.html',
  styleUrl: './section-editor-text.component.scss'
})
export class SectionEditorTextComponent {
  section = input.required<SectionText>();

  html = output<SectionText>();

  protected onInput(value: string) {
    this.section().Content.Html = value;
  }
}
