import { Pipe, PipeTransform, inject } from '@angular/core';
import { StrapiMedia } from '../types/types';
import { BASE_URL_UPLOADS } from './config';

@Pipe({
  name: 'strapiMedia',
  standalone: true,
})
export class StrapiMediaPipe implements PipeTransform {
  transform(
    value?: StrapiMedia | null,
    ...args: ('thumbnail' | 'small' | 'medium' | 'large' | 'xlarge' | 'original' | 'video')[]
  ): string {
    if(args[0] == 'video') {
      return this.getVideoUrl(value!);
    }
    return this.getImageFormatUrl(value, args[0] ?? 'large');
    //todo define default image if value is null | undefined
  }

  private getVideoUrl(media: StrapiMedia) {
    return BASE_URL_UPLOADS + media.url;
  }

  private getImageFormatUrl(
    image: StrapiMedia | null | undefined,
    size: 'thumbnail' | 'small' | 'medium' | 'large' | 'xlarge' | 'original',
  ): string {
    if (image == null) {
      return 'https://herzenshunde-strapi-prod.azurewebsites.net/uploads/paw_e60a248111.svg';
    }

    if (!image.formats) {
      return image.url;
    }

    let toReturn = '';

    switch (size) {
      case 'thumbnail':
        toReturn = image.formats.thumbnail.url;
        break;
      case 'small':
        toReturn = image.formats.small?.url ?? image.formats.thumbnail.url;
        break;
      case 'medium':
        toReturn =
          image.formats.medium?.url ??
          image.formats.small?.url ??
          image.formats.thumbnail.url;
        break;
      case 'large':
        toReturn =
          image.formats.large?.url ??
          image.formats.medium?.url ??
          image.formats.small?.url ??
          image.formats.thumbnail.url;
        break;
      case 'xlarge':
        toReturn =
          image.formats.xlarge?.url ??
          image.formats.large?.url ??
          image.formats.medium?.url ??
          image.formats.small?.url ??
          image.formats.thumbnail.url;
        break;
      case 'original':
        toReturn = image.url;
        break;
    }

    return BASE_URL_UPLOADS + toReturn;
  }
}
