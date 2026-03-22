import { Section, SectionSpecial, SectionType } from 'sheltify-lib/article-types';
import { CmsImage } from 'sheltify-lib/dist/cms-types';

export function createEmptySection(SectionType: SectionType): Section {
  switch (SectionType) {
    case 'columns':
      return {
        SectionType,
        BackgroundColor: '',
        Content: {
          FullWidth: false,
          Columns: [
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
    case 'form':
      return {
        SectionType,
        BackgroundColor: '',
        Content: {
          Name: '',
          SubmitButtonText: '',
          SubmitInfo: '',
          AfterSubmitText: '',
          Inputs: [],
          ForwardToEmails: [],
        }
      };
    case 'title':
      return {
        SectionType,
        BackgroundColor: '',
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
        BackgroundColor: '',
        Content: {
          Html: '',
        }
      };
    case 'video':
      return {
        SectionType,
        BackgroundColor: '',
        Content: {
          Title: '',
          Url: '',
        }
      };
    case 'image':
      return {
        SectionType,
        BackgroundColor: '',
        Content: {
          Size: 'medium',
          Layout: 'vertical',
          MediaFiles: [],
        }
      };
    case 'hero':
      return {
        SectionType,
        BackgroundColor: '',
        Content: {
          MediaFiles: [],
          Text: '',
          DurationSeconds: 5,
        }
      };
    case 'html':
      return {
        SectionType,
        BackgroundColor: '',
        Content: {
          Html: '',
        }
      };
    case 'animal-list':
      return {
        SectionType,
        BackgroundColor: '',
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
        BackgroundColor: '',
        Content: {
          From: undefined,
          To: undefined,
        },
      };
    case 'separator-x':
      return {
        SectionType,
        BackgroundColor: '',
      };
    case 'file':
      return {
        SectionType,
        BackgroundColor: '',
        Content: {
          File: undefined,
          Text: '',
        },
      };
    case 'animal-updates':
        return {
          SectionType,
          BackgroundColor: '',
          Content: {
            days: 7,
            layout: 'compact',
          },
          TempAnimalsByArticle: {},
        };
    case 'special':
        return {
          SectionType,
          BackgroundColor: '',
          Content: {
            Type: '',
            Properties: [],
            PropertyValues: [],
          },
          TempData: undefined,
        };
    default:
      assertUnreachable(SectionType);
  }
}

export function newSpecialSection(Name: string, SpecialArticleSections: Record<string, {Name: string, Type: "string" | "number" | "boolean" | "image" }[]>): SectionSpecial {
  const section = createEmptySection('special') as SectionSpecial;
  section.Content.Type = Name;
  console.log("SpecialArticleSections[Name]", SpecialArticleSections[Name])
  section.Content.Properties = SpecialArticleSections[Name].map(property => (
    [property.Name, property.Type]
  ));
  section.Content.PropertyValues = section.Content.Properties.map(property => {
    const propertyType = property[1];
    switch (propertyType) {
      case 'string':
        return '';
      case 'number':
        return 0;
      case 'boolean':
        return false;
      case 'image':
        return undefined;
      default:
        return undefined;
    }
  })
  console.log(section.Content)
  return section;
}

function assertUnreachable(_: never): never {
  throw new Error("Didn't expect to get here");
}
