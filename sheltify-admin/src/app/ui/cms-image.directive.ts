import { Directive, ElementRef, input, OnChanges, Renderer2 } from '@angular/core';
import { CmsImage, CmsImagesSize } from 'src/app/cms-types/cms-types';
import { CmsRequestService } from 'src/app/services/cms-request.service';

@Directive({
  selector: 'img[cmsImage]',
  standalone: true,
})
export class CmsImageDirective implements OnChanges {

  cmsImage = input.required<CmsImage>();
  cmsImageSize = input<CmsImagesSize>('medium');

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    this.updateImage();
  }

  private updateImage(): void {
    const imgEl: HTMLImageElement = this.el.nativeElement;
    const url = this.getImageFormatUrl(this.cmsImage(), this.cmsImageSize());
    this.renderer.setAttribute(imgEl, 'src', url);
    this.renderer.setAttribute(imgEl, 'alt', this.cmsImage().Description || 'Image');
  }

  private getImageFormatUrl(image: CmsImage, requestedSize: CmsImagesSize): string {
    const availableSize = this.getLargestAvailableSize(requestedSize, image);
    return `${CmsRequestService.publicApiUrl}uploads/${image.ID}_${availableSize}.webp`;
  }

  private getLargestAvailableSize(requestedSize: CmsImagesSize, image: CmsImage): CmsImagesSize {
    const sizeOrder: CmsImagesSize[] = ['thumbnail', 'small', 'medium', 'large', 'xlarge'];

    const requestedIndex = sizeOrder.indexOf(requestedSize);
    const availableIndex = sizeOrder.indexOf(image.LargestAvailableSize);

    if (availableIndex <= requestedIndex) {
      return image.LargestAvailableSize;
    } else {
      return sizeOrder[requestedIndex];
    }
  }
}
