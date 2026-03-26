import type { SectionSpecial } from 'sheltify-lib/dist/article-types';
import { CmsAnimal, CmsImage } from 'sheltify-lib/dist/cms-types';

export function getPropValue<T extends string | number | boolean | CmsImage>(section: SectionSpecial, propName: string): T {
  const index = section.Content.Properties.findIndex(prop => prop[0] === propName);
  return section.Content.PropertyValues[index];
}

export function searchAnimal(search: string, animalKind: string, allAnimals: CmsAnimal[]): CmsAnimal[] {
    const dogs = allAnimals.filter(animal => animal.AnimalKind == animalKind)
    return search.length > 0
      ? dogs.filter(animal => animal.Name.toLowerCase().includes(search.toLowerCase()))
      : dogs
}
