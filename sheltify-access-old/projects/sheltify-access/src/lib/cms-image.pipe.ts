import { Pipe, PipeTransform, inject } from '@angular/core';
import { StrapiMedia, CmsImagesSize, CmsImage } from '../types/types';
import { BASE_URL_UPLOADS, CMS_PUBLIC_URL } from './config';

@Pipe({
  name: 'cmsMedia',
  standalone: true,
})
export class CmsMediaPipe implements PipeTransform {
  transform(
    value?: CmsImage | null,
    ...args: CmsImagesSize[]
  ): string {
    return this.getImageFormatUrl(value, args[0] ?? 'large');
    //todo define default image if value is null | undefined
  }

  private getImageFormatUrl(
    image: CmsImage | null | undefined,
    requestedSize: CmsImagesSize,
  ): string {
    if (image == null) {
      return 'https://herzenshunde-strapi-prod.azurewebsites.net/uploads/paw_e60a248111.svg'; //TODO
    }
    const availableSize = this.getLargestAvailableSize(requestedSize, image);
    return `${CMS_PUBLIC_URL}uploads/${image.ID}_${availableSize}.webp`;
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
