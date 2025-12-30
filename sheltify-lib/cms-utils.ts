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
