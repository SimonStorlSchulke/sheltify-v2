import { AsyncPipe } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgIcon } from '@ng-icons/core';
import { Section } from 'sheltify-lib/article-types';
import { SectionEditorAnimalListComponent } from 'src/app/editor/article-editor/section-editor-animal-list/section-editor-animal-list.component';
import { SectionEditorColumnsComponent } from 'src/app/editor/article-editor/section-editor-columns/section-editor-columns.component';
import { SectionEditorHeroComponent } from 'src/app/editor/article-editor/section-editor-hero/section-editor-hero.component';
import { SectionEditorHtmlComponent } from 'src/app/editor/article-editor/section-editor-html/section-editor-html.component';
import { SectionEditorImagesComponent } from 'src/app/editor/article-editor/section-editor-images/section-editor-images.component';
import { SectionEditorTitleComponent } from 'src/app/editor/article-editor/section-editor-title/section-editor-title.component';
import { SectionEditorVideoComponent } from 'src/app/editor/article-editor/section-editor-video/section-editor-video.component';
import { SectionEditorTextComponent } from 'src/app/editor/article-editor/text-section-editor/section-editor-text.component';
import { renderArticleSection, sectionLabels } from 'src/app/services/article-renderer';

@Component({
  selector: 'app-section-editor',
  imports: [
    SectionEditorAnimalListComponent,
    SectionEditorColumnsComponent,
    SectionEditorHeroComponent,
    SectionEditorHtmlComponent,
    SectionEditorImagesComponent,
    SectionEditorTextComponent,
    SectionEditorTitleComponent,
    SectionEditorVideoComponent,
    AsyncPipe,
    NgIcon
  ],
  templateUrl: './section-editor.component.html',
  styleUrl: './section-editor.component.scss',
})
export class SectionEditorComponent {
  public section = input.required<Section>();
  triggerRerenderVal = signal(0);

  constructor(private domSanitizer: DomSanitizer) {

  }


  public triggerRerender() {
    this.triggerRerenderVal.update(v => v + 1);
  }

  public renderedSection = computed(async () => {
    this.triggerRerenderVal();

    const sections: SafeHtml[][] = [];

    const rowHtml: SafeHtml[] = [];
    const html = this.domSanitizer.bypassSecurityTrustHtml(await renderArticleSection(this.section()));
    rowHtml.push(html);
    sections.push(rowHtml);

    return sections;

  });
  protected readonly sectionLabels = sectionLabels;

  public enterMoveMode() {

  }

  public deleteSection() {

  }
}
