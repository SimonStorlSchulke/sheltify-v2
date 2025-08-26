import { Component, Input } from '@angular/core';
import { StrapiMedia } from '../../../../types/types';
import { StrapiMediaPipe } from '../../../strapi-image.pipe';

export type ArticleHeroSection = {
  __component: 'article-section.hero';
  background?: "nein" | "grün" | "beige";
  hero: StrapiMedia;
};

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [StrapiMediaPipe],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {
  @Input({required: true}) sectionData!: ArticleHeroSection;
}
