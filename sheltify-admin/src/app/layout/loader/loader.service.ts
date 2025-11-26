import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  public loadingInfos = signal(new Set<string>())

  public setLoading(info: string) {
    this.loadingInfos().add(info);
    this.loadingInfos.set(this.loadingInfos());
  }

  public unsetLoading(info: string) {
    this.loadingInfos().delete(info);
    this.loadingInfos.set(this.loadingInfos());
  }
}
