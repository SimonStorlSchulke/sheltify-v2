import { Component, inject, Input } from '@angular/core';
import { LightboxComponent } from '../lightbox/lightbox.component';
import { StrapiMediaPipe } from '../strapi-image.pipe';
import { StrapiMedia } from '../../types/types';
import { StrapiService } from '../strapi.service';
import { LightboxService } from '../lightbox/lightbox.service';

@Component({
  selector: 'app-strapi-media',
  standalone: true,
  imports: [StrapiMediaPipe, LightboxComponent, StrapiMediaPipe],
  templateUrl: './strapi-media.component.html',
  styleUrl: './strapi-media.component.scss',
})
export class StrapiMediaComponent {
  @Input({required: true}) media?: StrapiMedia[] = [];
  @Input() asGallery: boolean = true;
  @Input() imagePosition: string = "solo";
  strapiSv = inject(StrapiService);
  lightboxSv = inject(LightboxService);
}
