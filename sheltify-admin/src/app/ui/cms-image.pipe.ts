import { Pipe, PipeTransform } from '@angular/core';
import { CmsImage, CmsImagesSize } from 'sheltify-lib/cms-types';
import { getImageFormatUrl } from '@app/services/article-renderer';

@Pipe({
  name: 'cmsImageTTTT',
  standalone: true,
})
export class CmsImagePipe implements PipeTransform {
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
    return getImageFormatUrl(image, requestedSize);
  }
}
