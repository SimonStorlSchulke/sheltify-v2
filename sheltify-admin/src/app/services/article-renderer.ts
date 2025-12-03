import { Section, SectionImages, SectionType } from 'src/app/cms-types/article-types';
import { CmsImage, CmsImagesSize } from 'src/app/cms-types/cms-types';
import { CmsRequestService } from 'src/app/services/cms-request.service';

export class ArticleRenderer {
  //TODO move here
}

export function renderArticleSection(section: Section) {
  let contentHtml = '';

  switch (section.SectionType) {
    case 'text':
      contentHtml = section.Content.Html;
      break;
    case 'title':
      contentHtml = `<${section.Content.Type}>${section.Content.Text}</${section.Content.Type}>`;
      break;
    case 'image':
      contentHtml = renderImageSection(section);
      break;
    default:
      contentHtml = 'Vorschau noch nicht implementiert';
  }

  return `<div class="section-container ${section.SectionType}">${contentHtml}</div>`;
}


function renderImageSection(section: SectionImages) {
  const content = section.Content;
  if (content.MediaFiles.length === 0) return '';
  const isSingle = content.MediaFiles.length === 1;

  if (isSingle) {
    return `<img src="${getImageFormatUrl(content.MediaFiles[0], 'large')}">`
  } else {
    return renderImageTiles(section);
  }
}


function renderImageTiles(section: SectionImages) {
  let html = ' <div class="imagegrid">';
  for (const media of section.Content.MediaFiles) {
    const src = getImageFormatUrl(media, 'medium');
    html += `<img
          class="sui rounded-2 c-pointer"
          alt="media[0].alternativeText"
          src="${src}"
          />`;
  }
  html += '</div>';
  return html;
}

export function createArticleStyle() {
  let style = '.section-preview .section-container {';

  style += defaultGeneralArticleStyle;

  for (const [sectionType, sectionStyle] of defaultSectionStyles) {
    style += `&.${sectionType} {${sectionStyle}}`;
  }
  console.log(style)
  return style;
}

const defaultGeneralArticleStyle = `
  color: #444;
  font-size: 1.2rem;
`;

const defaultTitleStyle = `
h1 {font-size: 3.8rem;}
  h2 {font-size: 2.8rem;}
  h3 {font-size: 1.85rem;}
  h4 {font-size: 1.55rem;}
`;

const defaultImagesStyle = `
.imagegrid {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  align-items: start;
  gap: 8px;
  width: 100%;
  min-width: 100%;
}
.imagegrid img {
  display: inline-block;
  height: 195px;
  object-fit: contain;
  max-width: 350px;
}
.imagegrid.imageposition-oben img, .imagegrid.imageposition-unten img, .imagegrid.imageposition-solo img {
  height: 300px;
  flex-grow: 1;
  object-fit: cover;
  object-position: center 30%;
}

`;

const defaultSectionStyles = new Map<SectionType, string>([
  ['title', defaultTitleStyle],
  ['image', defaultImagesStyle],
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
