import { Service, computed, signal } from '@angular/core';

@Service()
export class LoaderService {
  /** info text -> number of currently running operations with that text */
  private loadingCounts = signal(new Map<string, number>());

  loadingInfos = computed(() => new Set(this.loadingCounts().keys()));

  setLoading(info: string) {
    this.loadingCounts.update(counts => {
      const next = new Map(counts);
      next.set(info, (next.get(info) ?? 0) + 1);
      return next;
    });
  }

  unsetLoading(info: string) {
    this.loadingCounts.update(counts => {
      const current = counts.get(info);
      if (!current) return counts;
      const next = new Map(counts);
      if (current <= 1) {
        next.delete(info);
      } else {
        next.set(info, current - 1);
      }
      return next;
    });
  }
}
