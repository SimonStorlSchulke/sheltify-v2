import { firstValueFrom } from 'rxjs';
import { Section } from 'sheltify-lib/article-types';
import { animalsByArticleId } from 'sheltify-lib/dist/animal-util';
import { CmsRequestService } from '@app/services/cms-request.service';

/**
 * Loads the data that dynamic sections (animal lists, animal updates, ...) show in their preview
 * into their `Temp*` fields. It is not saved with the article - the website loads it itself.
 * @returns whether the section has dynamic data (and the preview should be re-rendered)
 */
export async function loadSectionTempData(section: Section, cmsRequestService: CmsRequestService): Promise<boolean> {
  switch (section.SectionType) {
    case 'animal-list':
      section.TempFoundAnimals = await firstValueFrom(cmsRequestService.getFilteredAnimals(section.Content));
      return true;
    case 'animal-updates':
      section.TempAnimalsByArticle = animalsByArticleId(await firstValueFrom(cmsRequestService.getAnimalUpdates(section.Content.days)));
      return true;
    case 'home-found-feedback':
      section.TempData = await firstValueFrom(cmsRequestService.getHomeFoundEntries());
      return true;
    case 'columns': {
      const loaded = await Promise.all(section.Content.Columns
        .flatMap(column => column.Sections)
        .map(columnSection => loadSectionTempData(columnSection, cmsRequestService)));
      return loaded.includes(true);
    }
    default:
      return false;
  }
}
