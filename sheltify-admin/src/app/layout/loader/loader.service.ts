import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  public loadingInfos = signal(new Set<string>())

  public setLoading(info: string) {
    console.log("Set", info);
    this.loadingInfos().add(info);
    this.loadingInfos.set(this.loadingInfos());
  }

  public unsetLoading(info: string) {
    console.trace("Unset", info);
    this.loadingInfos().delete(info);
    this.loadingInfos.set(this.loadingInfos());
  }
}
