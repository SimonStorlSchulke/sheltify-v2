import { CmsImage } from './cms-types';

export function sortByPriorityAndUpdatedAt<T extends { Priority: number; UpdatedAt?: string | Date | null }>(entries: T[]) {
  return entries.sort((a, b) => {
    if (a.Priority !== b.Priority) {
      return b.Priority - a.Priority;
    }
    const dateA = new Date(a.UpdatedAt ?? "2000-01-01").getTime();
    const dateB = new Date(b.UpdatedAt ?? "2000-01-01").getTime();
    return dateB - dateA;
  });
}

export function filterPublishedAndHasArticle<T extends {PublishedAt?: { Valid: boolean }, ArticleID?: string}>(list: T[]) {
  return list.filter(entry => !!entry.ArticleID && entry.PublishedAt?.Valid);
}

function isCmsImage(obj: any): obj is CmsImage {
  return obj && typeof obj === 'object' && 'LargestAvailableSize' in obj;
}

export function collectCmsImageGuidsDeep<T>(input: T): string[] {
  const ids: string[] = [];

  function collect(obj: any) {
    if (!obj) return;

    if (isCmsImage(obj)) {
      if (obj.ID) ids.push(obj.ID);
      return;
    }

    if (Array.isArray(obj)) {
      obj.forEach(collect);
      return;
    }

    if (typeof obj === "object") {
      Object.values(obj).forEach(collect);
    }
  }

  collect(input);

  return [...new Set(ids.filter(Boolean))];
}