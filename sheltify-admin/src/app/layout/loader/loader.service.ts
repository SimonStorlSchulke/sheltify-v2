import { Service, signal } from '@angular/core';

@Service()
export class LoaderService {
  loadingInfos = signal(new Set<string>())

  setLoading(info: string) {
    this.loadingInfos().add(info);
    this.loadingInfos.set(this.loadingInfos());
  }

  unsetLoading(info: string) {
    this.loadingInfos().delete(info);
    this.loadingInfos.set(this.loadingInfos());
  }
}
