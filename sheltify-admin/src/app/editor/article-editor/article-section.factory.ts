import { Section, SectionType } from 'src/app/cms-types/article-types';

export function createEmptySection(SectionType: SectionType): Section {
  switch (SectionType) {
    case 'title':
      return {
        SectionType,
        Content: {
          Text: '',
          Type: 'h1',
          Anchor: '',
        }
      };
    case 'text':
      return {
        SectionType,
        Content: {
          Html: '',
        }
      };
    case 'video':
      return {
        SectionType,
        Content: {
        }
      };
    case 'image':
      return {
        SectionType,
        Content: {
          MediaFiles: [],
        }
      };
    case 'animal-list':
      return {
        SectionType,
        Content: {
          AnimalKind: undefined,
          MaxNumber: undefined,
          AgeRange: [undefined, undefined],
          SizeRange: [undefined, undefined],
          Gender: 'both',
          InGermany: undefined,
        }
      };
    default:
      assertUnreachable(SectionType);
  }
}


function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}
