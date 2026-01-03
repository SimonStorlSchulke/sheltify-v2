import { Section, SectionType } from 'sheltify-lib/article-types';

export function createEmptySection(SectionType: SectionType): Section {
  switch (SectionType) {
    case 'columns':
      return {
        SectionType,
        Content: {
          Columns: [
            {
              Sections: [],
              Grow: 1,
            },
            {
              Sections: [],
              Grow: 1,
            },
            {
              Sections: [],
              Grow: 1,
            },
          ]
        }
      };
    case 'title':
      return {
        SectionType,
        Content: {
          Text: '',
          Type: 'h1',
          Anchor: '',
          Centered: false,
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
          DurationSeconds: 5,
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
          Names: '',
        },
        TempFoundAnimals: [],
      };
    case 'home-found':
      return {
        SectionType,
        Content: {
          From: undefined,
          To: undefined,
        },
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
