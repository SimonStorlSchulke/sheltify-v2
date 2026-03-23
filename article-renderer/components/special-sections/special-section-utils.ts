import type { SectionSpecial } from 'sheltify-lib/dist/article-types';
import { CmsImage } from 'sheltify-lib/dist/cms-types';

export function getPropValue<T extends string | number | boolean | CmsImage>(section: SectionSpecial, propName: string): T {
  const index = section.Content.Properties.findIndex(prop => prop[0] === propName);
  return section.Content.PropertyValues[index];
}
