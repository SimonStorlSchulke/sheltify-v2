import type { CmsImage, CmsImagesSize } from 'sheltify-lib/dist/cms-types';
import { getLargestAvailableImageSize } from 'sheltify-lib/image-utils';

const uploadsUrl = 'http://localhost:3000/api/uploads/' as const;

export function getImageSrc(image: CmsImage, requestedSize: CmsImagesSize): string {
  const availableSize = getLargestAvailableImageSize(requestedSize, image);
  return `${uploadsUrl}${image.ID}_${availableSize}.webp`;
}