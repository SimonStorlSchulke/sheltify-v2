import type { CmsImage, CmsImagesSize } from './cms-types';

/** svgs are stored unconverted as <ID>.svg instead of scaled webps */
export function isSvgFileName(fileName: string | undefined): boolean {
  return !!fileName?.toLowerCase().endsWith('.svg');
}

export function isSvgImage(image: CmsImage): boolean {
  return isSvgFileName(image.OriginalFileName);
}

/** File name of an image in the uploads folder: the original svg, or the best available scaled webp */
export function getImageFileName(image: CmsImage, requestedSize: CmsImagesSize): string {
  if (isSvgImage(image)) {
    return `${image.ID}.svg`;
  }
  return `${image.ID}_${getLargestAvailableImageSize(requestedSize, image)}.webp`;
}

/**
 * Path of an image in the uploads folder, with its last change as version query (?v=...).
 * Edited images keep their file names, so the version makes browsers load the new file,
 * while the backend can let browsers cache versioned files for a long time.
 */
export function getImagePath(image: CmsImage, requestedSize: CmsImagesSize): string {
  const version = image.UpdatedAt ? new Date(image.UpdatedAt).getTime() : NaN;
  const fileName = getImageFileName(image, requestedSize);
  return isNaN(version) ? fileName : `${fileName}?v=${version}`;
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