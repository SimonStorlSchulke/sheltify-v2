import { Directive, effect, ElementRef, input, Renderer2, inject } from '@angular/core';
import { CmsImage, CmsImagesSize } from 'sheltify-lib/cms-types';
import { getImageFormatUrl } from '@app/services/article-renderer';

@Directive({
  selector: 'img[cmsImage]',
  standalone: true,
})
export class CmsImageDirective {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);


  cmsImage = input.required<CmsImage>();
  cmsImageSize = input<CmsImagesSize>('medium');
  useFocusPoint = input(true);
  withCacheInvalidation = input(false);

  constructor() {
    effect(() => {
      const imgEl: HTMLImageElement = this.el.nativeElement;
      let url = getImageFormatUrl(this.cmsImage(), this.cmsImageSize());

      if(this.withCacheInvalidation()) {
        url += `?${new Date().getTime()}`;
      }

      this.renderer.setAttribute(imgEl, 'src', url);
      this.renderer.setAttribute(imgEl, 'alt', this.cmsImage().Description || 'Image');

      if(this.useFocusPoint()) {
        this.renderer.setStyle(imgEl, 'object-fit', 'cover');
        this.renderer.setStyle(imgEl, 'object-position',
          `${this.cmsImage().FocusX * 100}% ${this.cmsImage().FocusY * 100}%`);
      }
    });
  }
}
