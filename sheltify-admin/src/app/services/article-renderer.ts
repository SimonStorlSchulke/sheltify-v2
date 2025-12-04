import { Section, SectionAnimalList, SectionImages, SectionType } from 'src/app/cms-types/article-types';
import { CmsImage, CmsImagesSize } from 'src/app/cms-types/cms-types';
import { CmsRequestService } from 'src/app/services/cms-request.service';

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
    case 'html':
      contentHtml = section.Content.Html;
      break;
    case 'animal-list':
      contentHtml = renderAnimalList(section);
      break;
    default:
      contentHtml = 'Vorschau noch nicht implementiert für ' + section.SectionType;
  }

  return `<div class="section-container ${section.SectionType}">${contentHtml}</div>`;
}

export const sectionLabels = new Map<SectionType, string>([
  ['title', 'Titelsektion'],
  ['text', 'Textsektion'],
  ['image', 'Bildersektion'],
  ['video', 'Videosektion'],
  ['html', 'HTML'],
  ['animal-list', 'Tierliste (statisch)'],
])


function renderAnimalList(section: SectionAnimalList) {
  let html = '';

  for (const animal of section.TempFoundAnimals ?? []) {
    html += `<div class="animal-card">
    <img src="${animal.Portrait ? getImageFormatUrl(animal.Portrait, 'small') : '/assets/icons/plus.svg'}">
    <div class="sui flex-x center ai-center name-row">
      <span class="sui text-oswald text-secondary text-center p-1 px-2">${animal.Name}</span>
    </div>
</div>`
  }

  return html;
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

const defaultAnimalListStyle = `
display: flex;
flex-wrap: wrap;
gap: 48px;
justify-content: center;

.animal-card {
  width: 260px;
  height: 290px;
  transition: transform 0.23s, box-shadow 0.4s;
  display: block;
  background-color: #eee;
  position: relative;
  color: inherit;
  border-radius: 6px;
  overflow: hidden;
}
 .animal-card img {
  width: 100%;
  height: 230px;
  object-fit: cover;
}
 .animal-card:hover {
  transform: scale(1.03);
  box-shadow: 0 0 16px #000 6;
}
 .animal-card .name-row {
  padding-left: 0.5rem;
  padding-top: 0.3rem;
  font-size: 1.85rem;
  display: flex;
  justify-content: center;
}
 .animal-card .gender-icon {
  width: 1.6rem;
  height: 1.6rem;
}
 .animal-card .bubbles {
  position: absolute;
  bottom: 68px;
  left: 12px;
  display: flex;
  padding: 0;
  flex-direction: column;
  gap: 8px;
  align-items: start;
  font-family: oswald, system-ui;
  color: #fff;
}
 .animal-card .bubbles span {
  background-color: #66f;
  border-radius: 40px;
  padding: 2px 8px;
  font-size: 1rem;
  font-weight: 100;
}
 .animal-card .bubbles span.emergency {
  background-color: #f77;
}
`

const defaultSectionStyles = new Map<SectionType, string>([
  ['title', defaultTitleStyle],
  ['image', defaultImagesStyle],
  ['animal-list', defaultAnimalListStyle],
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
