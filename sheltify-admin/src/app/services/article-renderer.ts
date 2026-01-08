import { Section, SectionAnimalList, SectionColumns, SectionHero, SectionImages, SectionTitle, SectionType, SectionVideo } from 'sheltify-lib/article-types';
import { CmsImage, CmsImagesSize } from 'sheltify-lib/cms-types';
import { CmsRequestService } from 'src/app/services/cms-request.service';

export const sectionLabels = new Map<SectionType, string>([
  ['title', 'Titelsektion'],
  ['text', 'Textsektion'],
  ['image', 'Bildersektion'],
  ['video', 'Videosektion'],
  ['html', 'HTML'],
  ['animal-list', 'Tierliste (statisch)'],
  ['separator-x', 'Trenner'],
  ['hero', 'Hero'],
  ['columns', 'Spalten'],
]);

export function getImageFormatUrl(image: CmsImage, requestedSize: CmsImagesSize): string {
  const availableSize = getLargestAvailableImageSize(requestedSize, image);
  return `${CmsRequestService.publicApiUrl}uploads/${image.ID}_${availableSize}.webp`;
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
