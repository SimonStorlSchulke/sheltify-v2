import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { Section } from 'sheltify-lib/article-types';
import { SectionEditorAnimalListComponent } from '@app/editor/article-editor/section-editor-animal-list/section-editor-animal-list.component';
import { SectionEditorColumnsComponent } from '@app/editor/article-editor/section-editor-columns/section-editor-columns.component';
import { SectionEditorHeroComponent } from '@app/editor/article-editor/section-editor-hero/section-editor-hero.component';
import { SectionEditorHtmlComponent } from '@app/editor/article-editor/section-editor-html/section-editor-html.component';
import { SectionEditorImagesComponent } from '@app/editor/article-editor/section-editor-images/section-editor-images.component';
import { SectionEditorTitleComponent } from '@app/editor/article-editor/section-editor-title/section-editor-title.component';
import { SectionEditorVideoComponent } from '@app/editor/article-editor/section-editor-video/section-editor-video.component';
import { SectionEditorTextComponent } from '@app/editor/article-editor/text-section-editor/section-editor-text.component';
import { sectionLabels } from '@app/services/article-renderer';

@Component({
  selector: 'app-section-editor-column-sections',
  imports: [
    SectionEditorAnimalListComponent,
    SectionEditorHeroComponent,
    SectionEditorHtmlComponent,
    SectionEditorImagesComponent,
    SectionEditorTextComponent,
    SectionEditorTitleComponent,
    SectionEditorVideoComponent,
    NgIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './section-editor-column-sections.component.html',
})
export class SectionEditorColumnSectionsComponent {
  section = input.required<Section>();
  deletedSection = output();

  triggerRerender() {

  }

  readonly sectionLabels = sectionLabels;
}
