import { Component, Input, OnInit } from '@angular/core';
import { StrapiMedia } from '../../../../types/types';
import { StrapiMediaComponent } from '../../../strapi-media/strapi-media.component';

export type ArticleImageSection = {
  __component: 'article-section.image';
  background?: "nein" | "grün" | "beige";
  images: StrapiMedia[];
  gallery: boolean;
};

@Component({
  selector: 'app-image-section',
  standalone: true,
  imports: [StrapiMediaComponent],
  templateUrl: './image-section.component.html',
  styleUrl: './image-section.component.scss'
})
export class ImageSectionComponent implements OnInit {
  @Input({required: true}) sectionData!: ArticleImageSection;

  ngOnInit() {

  }
}
