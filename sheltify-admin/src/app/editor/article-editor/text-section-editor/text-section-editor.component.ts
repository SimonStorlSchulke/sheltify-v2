import { Component, input } from '@angular/core';
import { CmsTextSection } from 'src/app/cms-types/article-types';
import { TextEditorComponent } from 'src/app/editor/text-editor/text-editor.component';

@Component({
  selector: 'app-text-section-editor',
  imports: [
    TextEditorComponent
  ],
  templateUrl: './text-section-editor.component.html',
  styleUrl: './text-section-editor.component.scss'
})
export class TextSectionEditorComponent {
  section = input<CmsTextSection>();
}
