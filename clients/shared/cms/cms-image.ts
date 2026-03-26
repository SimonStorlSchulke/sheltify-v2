import { cms } from '@shared/cms/sheltify-access.ts';
import type { CmsImage, CmsImagesSize } from 'sheltify-lib/cms-types.ts';

export function getImageSrc(image: CmsImage, requestedSize: CmsImagesSize): string {
  if(image.OriginalFileName.endsWith('.svg')) {
    return `${cms.uploadsUrl}${image.ID}.svg`;
  }
  const availableSize = getLargestAvailableImageSize(requestedSize, image);
  return `${cms.uploadsUrl}${image.ID}_${availableSize}.webp`;
}

export function getSvgSrc(image: CmsImage): string {
  return `${cms.uploadsUrl}${image.ID}`;
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

function isCmsImage(obj: any): obj is CmsImage {
  return obj && typeof obj === 'object' && 'LargestAvailableSize' in obj;
}

// refetch images because they are only present in the static json of the article, so not guaranteed to be updated
export async function refetchCmsImagesDeep<T>(
  input: T,
): Promise<T> {
  const images: CmsImage[] = [];

  function collect(obj: any) {
    if (!obj) return;

    if (isCmsImage(obj)) {
      if (obj.ID) images.push(obj);
      return;
    }

    if (Array.isArray(obj)) {
      obj.forEach(collect);
      return;
    }

    if (typeof obj === 'object') {
      Object.values(obj).forEach(collect);
    }
  }

  collect(input);

  if (images.length === 0) return input;

  const uniqueIds = [...new Set(images.map(img => img.ID).filter(Boolean))];

  const fetchedImages = await cms.getMediaFilesByIds(uniqueIds);

  const map = new Map(fetchedImages.map(img => [img.ID, img]));

  // --- 4. Replace images ---
  function replace(obj: any): any {
    if (!obj) return obj;

    if (isCmsImage(obj)) {
      return map.get(obj.ID) ?? obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(replace);
    }

    if (typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = replace(value);
      }
      return result;
    }

    return obj;
  }

  return replace(input);
}