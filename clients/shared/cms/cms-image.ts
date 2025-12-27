import { cms } from '@shared/cms/sheltify-access.ts';
import type { CmsImage, CmsImagesSize } from 'sheltify-lib/cms-types.ts';

export function getImageSrc(image: CmsImage, requestedSize: CmsImagesSize): string {
  const availableSize = getLargestAvailableImageSize(requestedSize, image);
  return `${cms.uploadsUrl}${image.ID}_${availableSize}.webp`;
}

export function getLargestAvailableImageSize(requestedSize: CmsImagesSize, image: CmsImage): CmsImagesSize {
  const sizeOrder: CmsImagesSize[] = ['thumbnail', 'small', 'medium', 'large', 'xlarge'];

  const requestedIndex = sizeOrder.indexOf(requestedSize);
  const availableIndex = sizeOrder.indexOf(image.LargestAvailableSize);

  if (availableIndex <= requestedIndex) {
    return image.LargestAvailableSize;
  } else {
    return sizeOrder[requestedIndex];
  }
}