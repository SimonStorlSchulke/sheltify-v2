import { Injectable } from '@angular/core';
import { CmsImage } from 'sheltify-lib/cms-types';
import { MediaLibraryComponent } from 'src/app/media-library/media-library.component';
import { ModalService } from 'src/app/services/modal.service';

@Injectable({
  providedIn: 'root',
})
export class ModalPresenter {

  constructor(private modalService: ModalService) {
  }

  public async openMediaLibrary(): Promise<CmsImage[] | undefined> {
    return await this.modalService.openFinishable<CmsImage[], MediaLibraryComponent>(
      MediaLibraryComponent,
      {
        isPicker: true,
      },
      'modal-lg-no-padding'
    )
  }
}
