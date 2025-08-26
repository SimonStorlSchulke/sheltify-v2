import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

export type ArticleHtmlSection = {
  __component: 'article-section.html';
  background?: "nein" | "grün" | "beige";
  html: string;
};

@Component({
  selector: 'app-html-section',
  standalone: true,
  imports: [],
  templateUrl: './html-section.component.html',
  styleUrl: './html-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HtmlSectionComponent {
  @Input({ required: true }) sectionData!: ArticleHtmlSection;

  domSanitizer = inject(DomSanitizer);

  get html() {
    return this.domSanitizer.bypassSecurityTrustHtml(this.sectionData.html);
  }
}
