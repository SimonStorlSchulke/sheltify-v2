import { Component, input } from '@angular/core';
import { SectionColumns } from 'sheltify-lib/article-types';

@Component({
  selector: 'app-section-editor-columns',
  imports: [],
  templateUrl: './section-editor-columns.component.html',
  styleUrl: './section-editor-columns.component.scss',
})
export class SectionEditorColumnsComponent {
  public section = input.required<SectionColumns>();
}
