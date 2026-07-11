import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { Section } from 'sheltify-lib/article-types';
import { SectionEditorAnimalListComponent } from '@app/editor/article-editor/section-editor-animal-list/section-editor-animal-list.component';
import { SectionEditorAnimalUpdatesComponent } from '@app/editor/article-editor/section-editor-animal-updates/section-editor-animal-updates.component';
import { SectionEditorBlogsComponent } from '@app/editor/article-editor/section-editor-blogs/section-editor-blogs.component';
import { SectionEditorColumnsComponent } from '@app/editor/article-editor/section-editor-columns/section-editor-columns.component';
import { SectionEditorHeroComponent } from '@app/editor/article-editor/section-editor-hero/section-editor-hero.component';
import { SectionEditorHomeFoundComponent } from '@app/editor/article-editor/section-editor-home-found/section-editor-home-found.component';
import { SectionEditorHtmlComponent } from '@app/editor/article-editor/section-editor-html/section-editor-html.component';
import { SectionEditorImagesComponent } from '@app/editor/article-editor/section-editor-images/section-editor-images.component';
import { SectionEditorSpecialComponent } from '@app/editor/article-editor/section-editor-special/section-editor-special.component';
import { SectionEditorTitleComponent } from '@app/editor/article-editor/section-editor-title/section-editor-title.component';
import { SectionEditorVideoComponent } from '@app/editor/article-editor/section-editor-video/section-editor-video.component';
import { SectionEditorTextComponent } from '@app/editor/article-editor/text-section-editor/section-editor-text.component';
import { SectionEditorFormComponent } from "../../section-editor-form/section-editor-form.component";
import { SectionEditorFileComponent } from '../../section-editor-file/section-editor-file.component';

@Component({
  selector: 'app-section-editor-all-sections',
  imports: [
    SectionEditorAnimalListComponent,
    SectionEditorColumnsComponent,
    SectionEditorHeroComponent,
    SectionEditorHtmlComponent,
    SectionEditorImagesComponent,
    SectionEditorTextComponent,
    SectionEditorTitleComponent,
    SectionEditorVideoComponent,
    SectionEditorFormComponent,
    SectionEditorFileComponent,
    SectionEditorAnimalUpdatesComponent,
    SectionEditorSpecialComponent,
    SectionEditorHomeFoundComponent,
    SectionEditorBlogsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './section-editor-all-sections.component.html',
})
export class SectionEditorAllSectionsComponent {
  section = input.required<Section>()
  triggerRerender = output();
}
