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
  const animalsInArticle = [...(allAnimalsByArticle[animal.ArticleID ?? ''] ?? [])];
  animalsInArticle.sort((a, b) => a.ID.localeCompare(b.ID));
  const names = animalsInArticle.map(animal => animal.Name).join('-');
  return `/tierartikel/${names}`;
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

export function yearsOld(animal: CmsAnimal): number | null {
  if(!animal.Birthday.Valid) return null;
  const birthDate = new Date(animal.Birthday.Time!);
  let months: number = monthDiff(birthDate, new Date());
  return months / 12;
}

function monthDiff(d1: Date, d2: Date): number {
  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}
