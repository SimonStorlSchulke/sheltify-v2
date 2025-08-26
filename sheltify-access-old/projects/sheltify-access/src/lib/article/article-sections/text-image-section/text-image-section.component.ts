import { Component, Input, inject } from '@angular/core';
import { StrapiRichTextPipe } from '../strapi-rich-text.pipe';
import { RichTextNode } from '../../blockRenderer';
import { StrapiMediaComponent } from '../../../strapi-media/strapi-media.component';
import { StrapiMedia } from '../../../../types/types';

export type ArticleTextWithImageSection = {
  __component: 'article-section.text-with-image-section';
  background?: "nein" | "grün" | "beige";
  text: RichTextNode[];
  images?: StrapiMedia[];
  imagePosition: 'oben' | 'rechts' | 'links' | 'unten';
  gallery: boolean;
};

@Component({
  selector: 'app-text-image-section',
  standalone: true,
  imports: [StrapiRichTextPipe, StrapiMediaComponent],
  templateUrl: './text-image-section.component.html',
  styleUrl: './text-image-section.component.scss',
})
export class TextImageSectionComponent {
  @Input({ required: true }) sectionData!: ArticleTextWithImageSection;
}
