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
          Title: '',
          Url: '',
        }
      };
    case 'image':
      return {
        SectionType,
        Content: {
          MediaFiles: [],
        }
      };
    case 'hero':
      return {
        SectionType,
        Content: {
          MediaFiles: [],
          Text: '',
        }
      };
    case 'html':
      return {
        SectionType,
        Content: {
          Html: '',
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
        },
        TempFoundAnimals: [],
      };
    case 'separator-x':
      return {
        SectionType,
      };
    default:
      assertUnreachable(SectionType);
  }
}


function assertUnreachable(_: never): never {
  throw new Error("Didn't expect to get here");
}
