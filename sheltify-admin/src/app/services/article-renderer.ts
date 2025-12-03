import { Section } from 'src/app/cms-types/article-types';

export function renderArticleSection(section: Section): string {
  switch (section.SectionType) {
    case 'text':
      return section.Content.Html;
    case 'title':
      return `<${section.Content.Type}>${section.Content.Text}</${section.Content.Type}>`;
    default:
      return 'Vorschau noch nicht implementiert';
  }
}

function renderTitle() {

}

