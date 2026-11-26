import { config } from './config';
import { CmsAnimal, CmsImage, CmsImagesSize } from 'sheltify-lib/cms-types';
import { getImageFileName } from 'sheltify-lib/image-utils';

export function getImageSrc(image: CmsImage, requestedSize: CmsImagesSize): string {
  return `${config.uploadsUrl}${getImageFileName(image, requestedSize)}`;
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

/**
 * Sets the href of animal links (`<a class="animal-link" dataId="...">`, inserted
 * via "Tierlink" in the text editor) to the article of the animal, see getAnimalLink.
 * Links to unknown animals lose their href, so they render as plain text.
 * Without allAnimalsByArticle (preview in CMS UI) the html is returned unchanged.
 */
export function resolveAnimalLinks(html: string, allAnimalsByArticle: Record<string, CmsAnimal[]> | undefined): string {
  if (!allAnimalsByArticle || !html?.includes('animal-link')) return html;

  const animalsById = new Map(Object.values(allAnimalsByArticle).flat().map(animal => [animal.ID, animal]));

  return html.replace(/<a\b[^>]*>/g, tag => {
    if (!/\bclass="[^"]*\banimal-link\b/.test(tag)) return tag;

    // Older animal links stored the ID in the title attribute
    const animalId = getAttribute(tag, 'dataId') ?? getAttribute(tag, 'title');
    const animal = animalId ? animalsById.get(animalId) : undefined;
    const link = animal ? getAnimalLink(animal, allAnimalsByArticle) : null;

    const withoutHref = tag.replace(/\shref="[^"]*"/, '');
    return link ? withoutHref.replace(/^<a\b/, `<a href="${escapeAttribute(link)}"`) : withoutHref;
  });
}

/** Case-insensitive like HTML: the browser serializes "dataId" as "dataid". */
function getAttribute(tag: string, name: string): string | undefined {
  return tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'))?.[1];
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

export async function downloadFile(file: CmsImage) {
  // TODO replace with default download once deployed
  const response = await fetch(config.uploadsUrl + file.ID);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = getDownloadTitle(file);
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export function getDownloadTitle(file: CmsImage) {
  const extension = file.OriginalFileName.split('.').pop();
  const endsWithExtension = extension && file.Title.endsWith('.' + extension);
  let fileName = endsWithExtension ? file.Title : `${file.Title}.${extension}`;
  fileName = fileName.replace(/[^a-z0-9.äöüÄÖÜß]/gi, '_').toLowerCase();
  return fileName;
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
