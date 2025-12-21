import { Section, SectionAnimalList, SectionHero, SectionImages, SectionTitle, SectionType, SectionVideo } from 'sheltify-lib/article-types';
import { CmsImage, CmsImagesSize } from 'sheltify-lib/cms-types';
import { CmsRequestService } from 'src/app/services/cms-request.service';

const publicApiUrl = 'http://localhost:3000/api/'

export async function renderArticleSection(section: Section) {
  let contentHtml = '';

  switch (section.SectionType) {
    case 'text':
      contentHtml = section.Content.Html;
      break;
    case 'title':
      contentHtml = renderTitleSection(section);
      break;
    case 'image':
      contentHtml = await renderImageSection(section);
      break;
    case 'hero':
      contentHtml = await renderHeroSection(section);
      break;
    case 'html':
      contentHtml = section.Content.Html;
      break;
    case 'animal-list':
      contentHtml = renderAnimalList(section);
      break;
    case 'separator-x':
      contentHtml = `<hr>`;
      break;
    case 'video':
      contentHtml = renderVideoSection(section);
      break;
    default:
      contentHtml = 'Vorschau noch nicht implementiert';
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
  ['separator-x', 'Trenner'],
  ['hero', 'Hero'],
]);

function renderTitleSection(section: SectionTitle) {
  const c = section.Content;
  let html = c.Anchor ? `
  <${c.Type} class="title" id="${c.Anchor}">
    <span class="title-text"">${c.Text}</span>
    <a class="title-hashtag">#</a>
  </${c.Type}>`
  :
  `<${c.Type}>${c.Text}</${c.Type}>`

  if(c.Underline) {
    html += `<hr>`;
  }
  return html;
}


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


async function renderImageSection(section: SectionImages) {
  const content = section.Content;

  content.MediaFiles = await refetchMediaFiles(content.MediaFiles);

  if (content.MediaFiles.length === 0) return '';

  return renderImageTiles(section);
}

async function renderHeroSection(section: SectionHero) {
  const content = section.Content;

  content.MediaFiles = await refetchMediaFiles(content.MediaFiles);

  if (content.MediaFiles.length === 0) return '';
  const isSingle = content.MediaFiles.length === 1;

  let imgSection = '';
  if (isSingle) {

    const objectPosition = `${content.MediaFiles[0].FocusX * 100}% ${content.MediaFiles[0].FocusY * 100}%`

    imgSection = `<img class="hero-image" style="object-position: ${objectPosition}" src="${getImageFormatUrl(content.MediaFiles[0], 'large')}">`
  } else {
    imgSection = '';
  }

  const textSection = `<h1 class="hero-text">${content.Text}</h1>`

  return `${imgSection}${textSection}`;

}


function renderVideoSection(section: SectionVideo) {
  const videoId = getYouTubeVideoId(section.Content.Url);

  if(!videoId) {
    return 'Video konnte nicht geladen werden.'
  }

  return `
  <p>
  <iframe width="560" height="315"
  src="https://www.youtube.com/embed/${videoId}"
  title=""
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen><br>Powered by <a href="https://youtubeembedcode.com">youtube embed code</a> and <a href="https://casinomga.se/">nya casinon utan spelpaus mga</a></iframe>
  </p>
  `;
}

function getYouTubeVideoId(url: string) {
  if (typeof url !== 'string') return null;

  const patterns = [
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

async function refetchMediaFiles(images: CmsImage[]): Promise<CmsImage[]> {
  if(!images[0]) return [];
  const tenant = images[0].TenantID;
  let ids = images.map(f => f.ID).join(',');
  const refetchedImages = await fetch(`${publicApiUrl}${tenant}/media?ids=${ids}`);
  return await refetchedImages.json();
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

const defaultTextStyle = `
.article-button {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}

.article-button.primary {
  background: #0078d4;
  color: white;
}

.article-button.secondary {
  background: #fff;
  outline: 2px solid #0078d4;
}

.article-button.cto {
  background: #ed4f4f;
  color: white;
}

.article-button:hover {
  background: #005ea2;
}
`

const defaultTitleStyle = `
h1 {font-size: 3.8rem;}
h2 {font-size: 2.8rem;}
h3 {font-size: 1.85rem;}
h4 {font-size: 1.55rem;}

hr {
  margin: 12px 0;
  border: none;
  border-top: 2px solid #bbb;
}

.title {
  display: flex;
  align-items: center;
}

.title .title-text {
  flex-grow: 1;
}
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

const defaultHeroStyle = `
position: relative;
.hero-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.hero-text {
  position: absolute;
  bottom: 10px;
  left: 30px;
  color: white;
  font-size: 5rem;
  text-shadow: 0 0 16px #0006;
}
`

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

const defaultSeparatorStyle = `
hr {
  margin: 28px 0;
  border: none;
  border-top: 2px solid #bbb;
}
`;

const defaultSectionStyles = new Map<SectionType, string>([
  ['text', defaultTextStyle],
  ['title', defaultTitleStyle],
  ['image', defaultImagesStyle],
  ['hero', defaultHeroStyle],
  ['animal-list', defaultAnimalListStyle],
  ['separator-x', defaultSeparatorStyle],
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
