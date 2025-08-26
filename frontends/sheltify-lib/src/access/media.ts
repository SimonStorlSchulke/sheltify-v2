import { StrapiAccess } from 'access/strapi-access.ts';
import type { StrapiMedia } from 'types/strapi-media.ts';

export function getImageFormatUrl(
  image: StrapiMedia | null | undefined,
  size: "thumbnail" | "small" | "medium" | "large" | "xlarge" | "original",
): string {
  if (image == null) {
    return "";
  }

  if (!image.formats) {
    return image.url;
  }

  let toReturn = "";

  switch (size) {
    case "thumbnail":
      toReturn = image.formats.thumbnail.url;
      break;
    case "small":
      toReturn =
        image.formats.small?.url ??
        image.url;
      break;
    case "medium":
      toReturn =
        image.formats.medium?.url ??
        image.url;
      break;
    case "large":
      toReturn =
        image.formats.large?.url ??
        image.url;
      break;
    case "xlarge":
      toReturn =
        image.formats.xlarge?.url ??
        image.url;
      break;
    case "original":
      toReturn = image.url;
      break;
  }

  return StrapiAccess.uploadsBaseUrl + toReturn;
}
