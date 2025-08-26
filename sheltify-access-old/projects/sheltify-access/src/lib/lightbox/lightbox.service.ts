import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { StrapiMedia } from '../../types/types';

@Injectable({
  providedIn: 'root'
})
export class LightboxService {

  open$ = new Subject<{images: StrapiMedia[], startImgSrcs: string[], startIndex: number}>();

  openFullscreen(images: StrapiMedia[], startIndex: number, startImgSrcs: string[] = []) {
    this.open$.next({images, startImgSrcs, startIndex});
  }

}
