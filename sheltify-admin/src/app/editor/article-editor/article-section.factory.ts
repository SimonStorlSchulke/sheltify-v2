import { Section, SectionType } from 'src/app/cms-types/article-types';

export function createEmptySection(SectionType: SectionType): Section {
  switch (SectionType) {
    case 'title':
      return {
        SectionType,
        Content: {
          Text: '',
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
    default:
      assertUnreachable(SectionType)
  }
}


function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}
