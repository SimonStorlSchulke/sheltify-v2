import { Component, input, output } from '@angular/core';
import { Section } from 'sheltify-lib/article-types';
import { SectionEditorAnimalListComponent } from 'src/app/editor/article-editor/section-editor-animal-list/section-editor-animal-list.component';
import { SectionEditorColumnsComponent } from 'src/app/editor/article-editor/section-editor-columns/section-editor-columns.component';
import { SectionEditorHeroComponent } from 'src/app/editor/article-editor/section-editor-hero/section-editor-hero.component';
import { SectionEditorHtmlComponent } from 'src/app/editor/article-editor/section-editor-html/section-editor-html.component';
import { SectionEditorImagesComponent } from 'src/app/editor/article-editor/section-editor-images/section-editor-images.component';
import { SectionEditorTitleComponent } from 'src/app/editor/article-editor/section-editor-title/section-editor-title.component';
import { SectionEditorVideoComponent } from 'src/app/editor/article-editor/section-editor-video/section-editor-video.component';
import { SectionEditorTextComponent } from 'src/app/editor/article-editor/text-section-editor/section-editor-text.component';
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
],
  templateUrl: './section-editor-all-sections.component.html',
})
export class SectionEditorAllSectionsComponent {
  public section = input.required<Section>()
  public triggerRerender = output();
}
