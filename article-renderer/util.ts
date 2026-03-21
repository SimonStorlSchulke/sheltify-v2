import { config } from './config';
import { CmsAnimal, CmsImage, CmsImagesSize } from 'sheltify-lib/cms-types';
import { getLargestAvailableImageSize } from 'sheltify-lib/image-utils';

export function getImageSrc(image: CmsImage, requestedSize: CmsImagesSize): string {
  const availableSize = getLargestAvailableImageSize(requestedSize, image);
  return `${config.uploadsUrl}${image.ID}_${availableSize}.webp`;
}

export function getAnimalLink(animal: CmsAnimal, allAnimalsByArticle: Record<string, CmsAnimal[]> | undefined) {
  if (!allAnimalsByArticle) {
    //link not needed for preview in CMS UI
    return null;
  }
  const animalsInArticle = allAnimalsByArticle[animal.ArticleID ?? ''];
  animalsInArticle.sort((a: CmsAnimal, b: CmsAnimal) => a.ID.localeCompare(b.ID));
  const names = animalsInArticle.map(animal => animal.Name).join('-');
  return `/${animalsInArticle[0].AnimalKind}/${names}`;
}

export async function downloadFile(file: CmsImage): Promise<void> {
  // TODO replace with default download once deployed
  const response = await fetch(config.uploadsUrl + file.ID);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  const extension = file.OriginalFileName.split('.').pop();
  a.download = file.Title + '.' + extension;
  document.body.appendChild(a);
  a.click();

  a.remove();
  window.URL.revokeObjectURL(url);
}